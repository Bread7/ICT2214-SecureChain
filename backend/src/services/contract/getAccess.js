"use strict"
const path = require("path")
const knex = require(path.join(__dirname+"/../../db/db"));
const hre = require("hardhat");

module.exports = async function (req, reply) {
    const query = req.query;

    try {
        let contractsResult;
        // Get contract address
        contractsResult = await knex.select().from("contracts").where({
           user_id: query.id 
        });
        if (contractsResult.length < 1) {
            return reply.send({
                success: false,
                msg: "No such user"
            });
        }
        // Owner contract should have all permissions
        if (contractsResult[0].contract_type == "owner") {
            return reply.send({
                success: true,
                msg: "This user has an owner contract, all permissions given",
                data: [1]
            });
        }
        // Get whitelist details from contract
        const contract = await hre.ethers.getContractAt("User", contractsResult[0].deployment_address);
        let data = await contract.getWhitelist();

        // Have to manually copy and convert all values due to frozen immutability
        let ret = [];
        for (let i = 0; i < data.length; i++) {
            if (i == 2) {
                let innerRet = [];
                for (let j = 0; j < data[i].length; j++) {
                    innerRet.push(Object.assign([], data[i][j]));
                }
                ret.push(innerRet);
                continue;
            }
            ret.push(Object.assign([], data[i]))
        }
        // Loop through nested arrays and convert stupid bigint into number
        for (let i = 0; i < ret.length; i++) {
            for (let j = 0; j < ret[i].length; j++) {
                if (i == 2) {
                    for (let k = 0; k < ret[i][j].length; k++) {
                        if (typeof(ret[i][j][k]) == "bigint") {
                            ret[i][j][k] = Number(ret[i][j][k]);
                        }
                    }
                }
                if (typeof(ret[i][j]) == "bigint") {
                    ret[i][j] = Number(ret[i][j]); 
                }
            }
        }

        // Format data nicely into object
        let formatted = {};
        formatted.index = ret[0];
        formatted.attributeIndex = ret[1];
        formatted.permissions = ret[2];
        console.log("format = ", formatted)


        return reply.send({
            success: true,
            data: [formatted],
            msg: `Successfully retrieved whitelist permission of user ${query.id}`
        })
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error"
        })
    }
}