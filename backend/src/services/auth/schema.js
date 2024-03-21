const loginSchema = {
    summary: "Login API",
    description: "\>Compares with database of user credentials for authentication. Returns data in an object format with user id for storage on frontend.",
    tags: ["auth"],
    body: {
        description: "Use to login. Will return user's \`id\` that was stored in database. Make sure to store the return value inside cookie.",
        type: "object",
        required: ["username", "password"],
        properties: {
            username: { type: "string", examples: ["test1"] },
            password: { type: "string", examples: ["test1"] },
        },
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                data: { 
                    type: "object",
                    properties: { id: { type: "number" } },
                    // id: { type: "number" }
                },
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    }
}

const registerSchema = {
    summary: "Registration of new user or owner that does not exists in database and smart contract is not in blockchain",
    description: "\>Registers either new owner or user depending on the supplied input in request body",
    tags: ["auth"],
    body: {
        description: "Use to register details into database",
        required: ["username", "password", "user_wallet_address", "contract_type"],
        type: "object",
        properties: {
            username: { type: "string", examples: ["bob"] },
            password: { type: "string", examples: ["bob"] },
            user_wallet_address: { type: "string", examples: ["0x70edD58554b1aF727377e542E5DE046B41cd6351"] },
            contract_type: { type: "string", enum: ["user", "owner"] },
        },
        "x-examples": {
            "Register a user": {
                description: "This makes use of `contract_type: user`",
                value: {
                    username: "bob",
                    password: "bob",
                    user_wallet_address: "0x70edD58554b1aF727377e542E5DE046B41cd6351",
                    contract_type: "user"
                }
            },
            "Regiser an owner": {
                description: "This makes use of `contract_type: owner`",
                value: {
                    username: "tom",
                    password: "tom",
                    user_wallet_address: "0x70edD58554b1aF727377e542E5DE046B41cd6351",
                    contract_type: "owner"
                }
            }
        }
    },
    response: {
        200: {
            description: "Format of successful and correct API response",
            type: "object",
            properties: {
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    },
}

module.exports = { loginSchema, registerSchema }