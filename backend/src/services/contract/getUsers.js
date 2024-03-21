"use strict"

const path = require("path")
const knex = require(path.join(__dirname+"/../../db/db"));

module.exports = async function (req, reply) {
    let result;

    try {
        result = await knex.select("credentials.id", "credentials.username", "contracts.contract_type").from("credentials")
            .leftOuterJoin("contracts", "contracts.user_id", "credentials.id")
            .where({
                "contracts.contract_type": "user"
            });

    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error",
        });
    }
    return reply.send({
        success: true,
        data: result,
        msg: "Successfully retrieved all users"
    });
}