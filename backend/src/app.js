const path = require("path");
const autoload = require("@fastify/autoload");
require("dotenv/config");
const cors = require("@fastify/cors");
const lodash = require("lodash");

// Database initialisation
const knex = require("./db/db");

// Hardhat configs
const hre = require("hardhat");
const hreConfig = require("../hardhat.config");

// Swagger configs
const { swaggerOptions } = require("./configs/swagger");

// Ajv schema compiler configs
const { ajv } = require("./configs/ajv");

// Entry point to application
module.exports = function (fastify, opts, next) {
    // Modify new ajv schema compiler
    fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
        return ajv.compile(schema);
    });

    // Use decorate to pass params down the fastify instance chain
    fastify.decorate("path", path);
    fastify.decorate("knex", knex);
    fastify.decorate("hre", hre);
    fastify.decorate("hreConfig", hreConfig);
    fastify.decorate("lodash", lodash);

    // Allow frontend to connect to backend from different domain
    // Not sure if needed, check again during deployment
    // https://github.com/fastify/fastify-cors for documentations
    fastify.register(cors);

    // Register swagger docs into usable routes
    fastify.register(require("@fastify/swagger"), swaggerOptions);
    fastify.register(require("@fastify/swagger-ui"), {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, req, reply) => { return swaggerObject },
        transformSpecificationClone: true,
    });

    // Load all plugins in services directory
    fastify.register(autoload, {
        dir: path.join(__dirname, "services"),
        options: Object.assign({}, opts)
    });
    
    next();
}
