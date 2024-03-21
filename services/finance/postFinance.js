"use strict"

const path = require("path");
const knex = require(path.join(__dirname + "/../../db/db"));
const moment = require("moment");

module.exports = async function(req, reply) {
    const format = "YYYY-MM-DD HH:mm:ss";
    let date = new Date();
    let datetime =moment(date).format(format);
    const data = req.body;

    let result;
    try {
        result = await knex.insert({
            balance: data.balance,
            profits: data.profits,
            revenue: data.revenue,
            updated_at: datetime
        }).into("finance");
    } catch (err) {
        console.log(err);
        return reply.send({
            success: false,
            msg: "error"
        })
    };

    return reply.send({
        success: true,
        msg: "Successfully post finance data"
    });
}