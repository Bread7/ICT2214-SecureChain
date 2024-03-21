"use strict"

const getFinance = require("./getFinance");
const postFinance = require("./postFinance");
const { getFinanceSchema, postFinanceSchema } = require("./schema");

// Routes array of individual API services
const routes = [
    {
        method: "GET",
        url: "/getFinance",
        handler: getFinance,
        schema: getFinanceSchema,
    },
    {
        method: "POST",
        url: "/postFinance",
        handler: postFinance,
        schema: postFinanceSchema
    },
];

module.exports = function (fastify, opts, next) {

    // Route each API for service
    routes.forEach((api, index) => {
        fastify.route(api)
    });
    next();
}