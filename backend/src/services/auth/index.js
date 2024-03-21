"use strict"

const { loginSchema, registerSchema } = require("./schema")
const login = require("./login");
const register = require("./register")

// Routes array of individual API services
const routes = [
    {
        method: "POST",
        url: "/login",
        handler: login,
        schema: loginSchema
    },
    {
        method: "POST",
        url: "/register",
        handler: register,
        schema: registerSchema
    }
];

module.exports = function (fastify, opts, next) {

    // Route each API for service
    routes.forEach((api, index) => {
        fastify.route(api)
    });
    next();
} 