"use strict"

const path = require("path");
const knex = require(path.join(__dirname + "/../../db/db"));

module.exports = async function (req, reply) {
    const data = req.body;
    let result;

    try {
        result = await knex.insert({
            attribute_index: data.attribute_index,
            attribute: data.attribute
        }).into("permissions");
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error"
        });
    }

    return reply.send({
        success: true,
        msg: "Successfully added new permissions entry",
    });
}