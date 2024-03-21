"use strict"

const path = require("path");
const knex = require(path.join(__dirname+"/../../db/db"));
const hre = require("hardhat");
const { deployUser, deployUserWithPrivateKey } = require(path.join(__dirname + "/../../../scripts/deployUser"));
const { deployOwner, deployOwnerWithPrivateKey } = require(path.join(__dirname + "/../../../scripts/deployOwner"));

// This function is called only when specific user/owner needs to redeploy contract
// Will be a clean reset
module.exports = async function (req, reply) {
    const data = req.body;
    try {
        let credentialsResult, contractsResult, contractsData, newCredentialsResult, newContractsResult;
        // Check if user id is in credentials and contracts and extract data
        credentialsResult = await knex.select().from("credentials").where({
            id: data.id
        });
        if (credentialsResult.length == 0) {
            return reply.send({
                success: false,
                msg: "No such user."
            })
        }

        contractsResult = await knex.select().from("contracts").where({
            user_id: data.id
        });
        if (contractsResult.length == 0) {
            return reply.send({
                success: false,
                msg: "No such contract."
            });
        }
        // Redeploy new contract depending if user or owner
        if (contractsResult[0].contract_type == "user") {
            // Redeploy contract
            if (data.owner_private_key != "" || data.ownerPrivateKey != null || data.ownerPrivateKey != undefined) {
                contractsData = await deployUserWithPrivateKey(credentialsResult[0].username, data.user_wallet_address, data.owner_private_key);
            } else {
                contractsData = await deployUser(credentialsResult[0].username, data.user_wallet_address);
            }

        } else if (contractsResult[0].contract_type == "owner") {
            // Redeploy contract
            if (data.owner_private_key != "" || data.ownerPrivateKey != null || data.ownerPrivateKey != undefined) {
                contractsData = await deployOwnerWithPrivateKey(credentialsResult[0].username, data.owner_private_key);
            } else {
                contractsData = await deployOwner(credentialsResult[0].username);
            }

        }
        let contractAddress = await contractsData.getAddress();
        let transactionHash = await contractsData.deploymentTransaction().hash;

         // Update contracts table
         newContractsResult = await knex("contracts").where({
            user_id: credentialsResult[0].id
        }).update({
            transaction_hash: transactionHash,
            deployment_address: contractAddress
        });
        console.log(newContractsResult);

        // Update credentials table
        newCredentialsResult = await knex("credentials").where({
            id: data.id
        }).update({
            wallet_address: data.user_wallet_address
        });
        console.log(newCredentialsResult);

        // Update all user contracts with new owner address
        if (contractsResult[0].contract_type == "owner") {
            let userContractsResult = await knex.select().from("contracts").where({
                contract_type: "user"
            });
            for (const [key, val] of Object.entries(userContractsResult)) {
                const user = await hre.ethers.getContractAt("User", val.deployment_address);
                await user.addOwner(data.user_wallet_address);
            }
        }

        // No errors here means success in updating
        return reply.send({
            success: true,
            msg: "Successfully update contract."
        });

    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "Error"
        })
    }

}