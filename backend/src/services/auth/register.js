"use strict"
const path = require("path")
const knex = require(path.join(__dirname+"/../../db/db"));
const argon2 = require("argon2");
const hre = require("hardhat");
const { deployUser } = require(path.join(__dirname + "/../../../scripts/deployUser"));
const { deployOwner } = require(path.join(__dirname + "/../../../scripts/deployOwner"));

// Logic for handling registeration of account
module.exports = async function (req, reply) {
    const data = req.body;

    let credentialsResult, contractsResult, checkDb;
    try {
        // Check is username is in database
        checkDb = await knex.select().from("credentials").where({
            username: data.username
        });
        if (checkDb.length == 0) {
            // Add user/owner to database
            //
            // Generate password hash
            const passwordHash = await argon2.hash(data.password);

            // Generate user/owner contract using default private key
            if (data.contract_type == "user") {
                let userContract = await deployUser(data.username, data.user_wallet_address);
                let contractAddress = await userContract.getAddress();
                let transactionHash = await userContract.deploymentTransaction().hash;

                // Add to credentials table
                // Returns id from db table
                credentialsResult = await knex.insert({
                    username: data.username,
                    password: passwordHash,
                    wallet_address: data.user_wallet_address
                }).into("credentials");

                // Add to contracts table
                contractsResult = await knex.insert({
                    user_id: credentialsResult[0],
                    transaction_hash: transactionHash,
                    deployment_address: contractAddress,
                    contract_type: data.contract_type
                }).into("contracts");
            } else if (data.contract_type == "owner") {
                let ownerContract = await deployOwner(data.username);
                let contractAddress = await ownerContract.getAddress();
                let transactionHash = await ownerContract.deploymentTransaction().hash;

                // Add credentials table
                credentialsResult = await knex.insert({
                    username: data.username,
                    password: passwordHash,
                    wallet_address: data.user_wallet_address
                }).into("credentials");

                // Add to contracts table
                contractsResult = await knex.insert({
                    user_id: credentialsResult[0],
                    transaction_hash: transactionHash,
                    deployment_address: contractAddress,
                    contract_type: data.contract_type
                }).into("contracts");

                // Update all user contracts with new owner address
                let userContractsResult = await knex.select().from("contracts").where({
                    contract_type: "user"
                });
                for (const [key, val] of Object.entries(userContractsResult)) {
                    const user = await hre.ethers.getContractAt("User", val.deployment_address);
                    await user.addOwner(data.user_wallet_address);
                }
            }


        } else {
            return reply.send({
                success: false,
                msg: "User exists in database."
            })
        }
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "Error"
        })
    };

    return reply.send({
        success: true,
        msg: `Added ${data.username} into database`
    });
}