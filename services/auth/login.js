"use strict"

const path = require("path")
const knex = require(path.join(__dirname+"/../../db/db"));
const argon2 = require("argon2");

// Logic for handling login authentication
module.exports = async function (req, reply) {
    const data = req.body;

    try {
        const credential = await knex.select().from("credentials").where({
            username: data.username
        });
        if (await argon2.verify(credential[0].password, data.password)) {
            console.log(credential)
            return reply.send({
                data: {
                    id: credential[0].id
                },
                success: true,
                msg: "Successful request of credentials"
            });
        } else {
            return reply.send({
                success: false,
                msg: "No such username or password"
            });
        }
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "Error"
        });
    }
}