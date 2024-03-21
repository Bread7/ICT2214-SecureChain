const Ajv = require("ajv");
const ajv = new Ajv({
    // Fastify defaults
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    nullable: true,

    // Custom additions
    keywords: [
        {
            keyword: "x-examples"
        }
    ],
})

module.exports = { ajv }