"use strict"

const getPermissions = require("./getPermissions");
const postPermissions = require("./postPermissions");
const deletePermissions = require("./deletePermissions");
const { getPermissionsSchema, postPermissionsSchema, deletePermissionsSchema } = require("./schema");

const routes = [
    {
        method: "GET",
        url: "/getPermissions",
        handler: getPermissions,
        schema: getPermissionsSchema
    },
    {
        method: "POST",
        url: "/postPermissions",
        handler: postPermissions,
        schema: postPermissionsSchema
    },
    {
        method: "POST",
        url: "/deletePermissions",
        handler: deletePermissions,
        schema: deletePermissionsSchema
    }
];

module.exports = function(fastify, opts, next) {
    routes.forEach((api, index) => {
        fastify.route(api);
    });
    next();
}