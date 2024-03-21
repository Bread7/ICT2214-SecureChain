"use strict"

const path = require("path");
const knex = require(path.join(__dirname + "/../../db/db"));

module.exports = async function(req, reply) {
    let result;

    try {
        result = await knex.select().from("permissions");
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error"
        });
    }

    return reply.send({
        success: true,
        data: result,
        msg: "Successfully retrieved all permissiosn data"
    });
}