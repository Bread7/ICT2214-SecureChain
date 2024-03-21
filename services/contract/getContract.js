"use strict"

const path = require("path");
const knex = require(path.join(__dirname+"/../../db/db"));
const hre = require("hardhat");

module.exports = async function(req, reply) {
    const query = req.query;
    let result, contractData;

    try {
        // Get data from contracts table using user_id
        result = await knex.select().from("contracts").where({
            user_id: query.id
        });

        // Not needed, keep in case of changes to this API
        if (result[0].contract_type == "user" || query.contract_type == "user") {
            contractData = await hre.ethers.getContractAt("User", result[0].transaction_hash);
            console.log(contractData);
        } else if (result[0].contract_type == "owner" || query.contract_type == "owner") {
            contractData = await hre.ethers.getContractAt("Owner", result[0].transaction_hash);
            console.log(contractData);
        }
        
    } catch (err) {
        console.log(err)
        return reply.send({
            success: false,
            msg: "error"
        })
    }
    return reply.send({
        data: result,
        success: true,
        msg: "Successful retrieval of contract"
    });
}