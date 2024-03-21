"use strict"

const path = require("path");
const knex = require(path.join(__dirname + "/../../db/db"));

module.exports = async function (req, reply) {
    const data = req.body;
    let result;

    try {
        result = await knex("permissions").where({
            id: data.id
        }).del();
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error"
        });
    }

    return reply.send({
        success: true,
        msg: "Successfully update permissions entry"
    })
}