"use strict"

const path = require("path");
const knex = require(path.join(__dirname+"/../../db/db"));
const hre = require("hardhat");

// Get all users permissions
module.exports = async function (req, reply) {
    let credentialsResult, contractsResult;
    let allResult = [];

    try {
        credentialsResult = await knex.select().from("contracts").where({
            contract_type: "user"
        });
    
        // Loops all user contracts
        for (let i = 0; i < credentialsResult.length; i++) {
            contractsResult = await hre.ethers.getContractAt("User", credentialsResult[i].deployment_address);
            let userPermission = await contractsResult.getWhitelist();
            let ret = [];
            // Loops a user's permissions and perform deep copy
            for (let j = 0; j < userPermission.length; j++) {
                if (j == 2) {
                    let innerCopy = [];
                    for (let k = 0; k < userPermission[j].length; k++) {
                        innerCopy.push(Object.assign([], userPermission[j][k]));
                    }
                    ret.push(innerCopy);
                    continue;
                }
                ret.push(Object.assign([], userPermission[j]));
            }

            // Loops the deep copy permission and serialise the data
            for (let i = 0; i < ret.length; i++) {
                for (let j = 0; j < ret[i].length; j++) {
                    if (i == 2) {
                        for (let k = 0; k < ret[i][j].length; k++) {
                            if (typeof(ret[i][j][k]) == "bigint") {
                                // console.log(ret[i][j][k])
                                ret[i][j][k] = Number(ret[i][j][k]);
                                console.log(ret[i][j][k])
            
                            }
                        }
                        continue;
                    }
                    if (typeof(ret[i][j] == "bigint")) {
                        ret[i][j] = Number(ret[i][j]);
                    }
                }
            }
            let formatted = {};
            formatted.index = ret[0];
            formatted.attributeIndex = ret[1];
            formatted.permissions = ret[2];
            allResult.push(formatted);
        }

    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error"
        });
    }
    return reply.send({
        success: true,
        msg: "Successfully retrieve all users permission",
        data: allResult
    })

}