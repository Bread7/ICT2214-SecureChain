"use strict"

// const data = require("./data");
const addAccess = require("./addAccess");
const getAccess = require("./getAccess");
const updateContract = require("./updateContract");
const getContract = require("./getContract");
const removeAccess = require("./removeAccess");
const getUsers = require("./getUsers");
const getAllWhitelist = require("./getAllWhitelist");
const { updateContractSchema, getContractSchema, addAccessSchema, removeAccessSchema, getAccessSchema, 
    getUsersSchema, getAllWhitelistSchema } = require("./schema");

// Routes array of individual API services
const routes = [
    {
        method: "GET",
        url: "/getAccess",
        handler: getAccess,
        schema: getAccessSchema
    },
    {
        method: "POST",
        url: "/addAccess",
        handler: addAccess,
        schema: addAccessSchema
    },
    {
        method: "POST",
        url: "/removeAccess",
        handler: removeAccess,
        schema: removeAccessSchema
    },
    {
        method: "GET",
        url: "/getContract",
        handler: getContract,
        schema: getContractSchema
    },
    {
        method: "POST",
        url: "/updateContract",
        handler: updateContract,
        schema: updateContractSchema
    },
    {
        method: "GET",
        url: "/getUsers",
        handler: getUsers,
        schema: getUsersSchema
    },
    {
        method: "GET",
        url: "/getAllWhitelist",
        handler: getAllWhitelist,
        schema: getAllWhitelistSchema
    },
];

module.exports = function (fastify, opts, next) {

    // Route each API for service
    routes.forEach((api, index) => {
        fastify.route(api)
    });
    next();
}