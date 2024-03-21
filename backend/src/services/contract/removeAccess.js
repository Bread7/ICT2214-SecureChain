"use strict"
const path = require("path")
const knex = require(path.join(__dirname+"/../../db/db"));
const hre = require("hardhat");

module.exports = async function (req, reply) {
    const data = req.body;

    try {
        let contractsResult, contractData;

        // Get contract address
        contractsResult = await knex.select().from("contracts").where({
            user_id: data.id
        })

        if (contractsResult.length == 0) {
            return reply.send({
                success: false,
                msg: "No such user."
            });
        }

        // Check for owner private key and modify hardhat configs
        if (hre.network.name != "localhost") {
            // Use owner supplied keys
            if (data.owner_private_key) {
                hre.network.config.accounts = [];
                hre.network.config.accounts.push("0x" + data.owner_private_key);

            } else {
                // Use environment stored private keys
                hre.network.config.accounts = [];
                hre.network.config.accounts.push("0x" + process.env.OWNER_PRIVATE_KEY);
            }
        }

        // Get contract instance
        if (contractsResult[0].contract_type == "user" || data.contract_type == "user") {
            contractData = await hre.ethers.getContractAt("User", contractsResult[0].deployment_address);
            // Remove permission accesses
            for (const key in data["permissions"]) {
                console.log(key)
                console.log(data["permissions"][key])
                await contractData.removeAccess(key, data["permissions"][key]);
            }


            // No error here means success in removing
            return reply.send({
                success: true,
                msg: "Successfully removed access(es)."
            })
        } else if (contractsResult[0].contract_type == "owner" || data.contract_type == "owner") {
            // Owner has all access, nothing to remove
            return reply.send({
                success: true,
                msg: "Owner has all accesses already."
            })
        }
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error"
        })
    }
}