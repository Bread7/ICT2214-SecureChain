"use strict"

const getHome = require("./getHome");
const postHome = require("./postHome");
const { getHomeSchema, postHomeSchema } = require("./schema");

// Routes array of individual API services
const routes = [
    {
        method: "GET",
        url: "/getHome",
        handler: getHome,
        schema: getHomeSchema
    },
    {
        method: "POST",
        url: "/postHome",
        handler: postHome,
        schema: postHomeSchema
    },
];

module.exports = function (fastify, opts, next) {

    // Route each API for service
    routes.forEach((api, index) => {
        fastify.route(api)
    });
    next();
}