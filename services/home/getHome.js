"use strict"

const path = require("path");
const knex = require(path.join(__dirname + "/../../db/db"));

module.exports = async function(req, reply) {
    const query = req.query;

    let result;
    try {
        result = await knex.select().from("home");
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "Error"
        })
    };

    console.log(result);

    return reply.send({
        success: true,
        data: result,
        msg: "Successfully get home data"
    });
}