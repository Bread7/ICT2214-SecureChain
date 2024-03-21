const swaggerOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
    openapi: {
        openapi: "3.0.0",
        info: { 
            title: "SecureChain",
            description: "Backend APIs",
            version: "0.0.1",
        },
        contact: {
            name: "ZJ"
        },
        license: {
            name: "GNU GPL",
            url: "https://github.com/ctianle/websec/blob/main/backend/LICENSE"
        },
        servers: [
            {
                url: "http://127.0.0.1:3001",
                description: "Development server"
            },
        ],
        // host: "127.0.0.1:3001/",
        // basePath: "",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
            { name: "auth", description: "Authentication APIs for login and register" },
            { name: "contract", description: "Contract and Access Control Specifics APIs" },
            { name: "permissions", description: "Permissions database APIs" },
            { name: "finance", description: "Dummy finance APIs" },
            { name: "home", description: "Dummy home APIs" },
        ],
        definitions: {
            auth: {
                type: "object",
                // required: ["id"],
                properties: {
                    // id: { type: "number", format: "integer" },
                    username: { type: "string" },
                    password: { type: "string" },
                    // wallet_address: { type: "string", format: "hexadecimal"}
                }
            }
        }
    },
    refResolver: {
        buildLocalReference (json, baseUri, fragment, i) {
            return json.$id || `fragment-${i}`
        }
    }
}

module.exports = { swaggerOptions };