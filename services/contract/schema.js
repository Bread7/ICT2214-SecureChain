const updateContractSchema = {
    summary: "Redeploy contract of existing user/owner",
    description: "\>Create a new contract for specific user / owner and redeploy into the blockchain. Previous contract information will be replaced with new contract information. Does a clean reset of permissions for user contracts.",
    tags: ["contract"],
    body: {
        description: "Requires `user_wallet_address`, `id` and `permission` objects. `contract_type` is not necessary. Make sure to not duplicate permission object with same permission otherwise deletion causes a bug",
        type: "object",
        required: ["user_wallet_address", "id"],
        properties: {
            user_wallet_address: { type: "string" },
            owner_private_key: { type: "string" },
            contract_type: { type: "string", enum: ["user", "owner"] },
            id: { type: "number" },
        },
        "x-examples": {
            "Deploying with Specific Owner key": {
                description: "Make sure owner private key and wallet address are valid. Change values according to what is in your current database.",
                value: {
                    user_wallet_address: "0x14DFe92D1fb17842d3528C2cbdaaB9694a07ad1B",
                    owner_private_key: "a94032e46923b4ed1eb2a3f054bf34dc0ce60775fd046e825c4450aad598151b",
                    contract_type: "user",
                    id: 44
                }
            },  
            "Deploying without Owner key": {
                description: "Make sure owner private key is valid. Change values according to what is in your current database.",
                value: {
                    user_wallet_address: "0xF179AA274a101277912d2526f5Ab6f40F3380f76",
                    contract_type: "user",
                    id: 44
                },
            }
        }
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    }
}

const getContractSchema = {
    summary: "Returns contract details of specific user",
    description: "\>Uses query string in URL. Gets back contract details of specific user id.",
    tags: ["contract"],
    querystring: {
        description: "Uses URL query string `?` for this API. `contract_type` not necessary.",
        required: ["id"],
        type: "object",
        properties: {
            id: { type: "number" },
            contract_type: { type: "string", enum: ["user", "owner"] },
        },
    },
    "x-examples": {
        "With contract_type": {
            description: "Change value accordingly to data in your current database",
            value: {
                id: 44,
                contract_type: "user",
            },
        },
        "Without contract_type": {
            description: "Change value accordingly to data in your current database",
            value: {
                id: 44
            },
        }
    },
    response: {
        200: {
            description: "Format of successful and correct API response",
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            user_id: { type: "number" },
                            transaction_hash: { type: "string" },
                            deployment_address: { type: "string" },
                            contract_type: { type: "string" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: "string", format: "date-time" },
                        }
                    }
                },
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    },
}

const addAccessSchema = {
    summary: "Add permission to specific user contract",
    description: "\>Supplements `id` and `permission` to add access. `permission` is a nested object so can add multiple objects but avoid duplicating existing permission.",
    tags: ["contract"],
    body: {
        description: "Requires `id` and `permission` objects. `owner_private_key` is optional to add in.",
        type: "object",
        required: ["permissions", "id"],
        properties: {
            permissions: { 
                type: "object",
                properties: {
                    "attributeIndex": {
                        type: "object",
                        properties: {
                            attribute: { type: "string" },
                            start: { type: "number" },
                            end: { type: "number" },
                        },
                    },
                },
            },
            owner_private_key: { type: "string" },
            id: { type: "number" },
        },
        "x-examples": {
            "Deploying with Specific Owner key": {
                description: "Make sure owner private key and permissions are valid. Change values according to what is in your current database.",
                value: {
                    permissions: {
                        "30": {
                            attribute: "permission",
                            start: 0,
                            end: 0,
                        },
                    },
                    owner_private_key: "a94032e46923b4ed1eb2a3f054bf34dc0ce60775fd046e825c4450aad598151b",
                    id: 44
                }
            },  
            "Deploying without Owner key": {
                description: "Make sure `permissions` is valid. Change values according to what is in your current database.",
                value: {
                    permissions: {
                        "30": {
                            attritbute: "permission",
                            start: 0,
                            end: 0,
                        },
                    },
                    id: 44
                },
            }
        }
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    }
}

const removeAccessSchema = {
    summary: "Remove specific permission from user's smart contract",
    description: "\>Remove a permission from user's smart contract by supplementing an `id` and an object `permissions`",
    tags: ["contract"],
    body: {
        description: "Requires `id` and `permission` objects. In `permissions`, only require the index and attributeIndex (string) key pair value. `owner_private_key` is optional.",
        type: "object",
        required: ["permissions", "id"],
        properties: {
            permissions: { 
                type: "object",
                properties: {
                    "index": { type: "string" },
                },
            },
            owner_private_key: { type: "string" },
            id: { type: "number" },
        },
        "x-examples": {
            "Deploying with Specific Owner key": {
                description: "Make sure owner private key and permissions are valid. Change values according to what is in your current database.",
                value: {
                    permissions: {
                        "4": "30"
                    },
                    owner_private_key: "a94032e46923b4ed1eb2a3f054bf34dc0ce60775fd046e825c4450aad598151b",
                    id: 44
                }
            },  
            "Deploying without Owner key": {
                description: "Make sure `permissions` is valid. Change values according to what is in your current database.",
                value: {
                    permissions: {
                        "4": "30"
                    },
                    id: 44
                },
            }
        }
    },
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    }
}

const getAccessSchema = {
    summary: "Returns all whitelist permission of specific user contract",
    description: "\>Specify a `id` of a specific user and get all its whitelist permission data in original format. Specifications in response tab.",
    tags: ["contract"],
    querystring: {
        description: "Uses URL query string `?` for this API.",
        required: ["id"],
        type: "object",
        properties: {
            id: { type: "number" },
        },
    },
    "x-examples": {
        "With id": {
            description: "Gets all whitelist permission of specific user",
            value: {
                id: 44,
            },
        },
    },
    response: {
        200: {
            description: "Format of successful and correct API response. The first array is index, the second array is attributeIndex and the last array are the permissions.\
            Smart contract stores as a map: `index => attributeIndex => permission`",
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            index: { 
                                type: "array",
                                items: {
                                    type: "number",
                                },
                            },
                            attributeIndex: { 
                                type: "array",
                                items: {
                                    type: "string",
                                },
                            },
                            permissions: { 
                                type: "array",
                                items: {
                                    types: "array",
                                    items: {
                                        oneOf: [
                                            { type: "string" },
                                            { type: "number" },
                                        ]
                                    }
                                }
                            },
                        }
                    }
                },
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    },
}

const getUsersSchema = {
    summary: "Returns all users data",
    description: "\>No input needed. Gets back credentials details of of all users.",
    tags: ["contract"],
    "x-examples": {
        "Getting all users data": {
            description: "This is an example request",
        },
    },
    response: {
        200: {
            description: "Format of successful and correct API response",
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            username: { type: "string" },
                            contract_type: { type: "string" },
                        },
                    },
                    minItems: 1,
                },
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    },
}

const getAllWhitelistSchema = {
    summary: "Returns all whitelist permission of all users",
    description: "\>Get all its whitelist permission data in original format. Specifications in response tab.",
    tags: ["contract"],
    "x-examples": {
        "example request": {
            description: "Gets all whitelist permission of specific user",
        },
    },
    response: {
        200: {
            description: "Format of successful and correct API response. The first array is index, the second array is attributeIndex and the last array are the permissions.\
            Smart contract stores as a map: `index => attributeIndex => permission`",
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            index: { 
                                type: "array",
                                items: {
                                    type: "number",
                                },
                            },
                            attributeIndex: { 
                                type: "array",
                                items: {
                                    type: "string",
                                },
                            },
                            permissions: { 
                                type: "array",
                                items: {
                                    types: "array",
                                    items: {
                                        oneOf: [
                                            { type: "string" },
                                            { type: "number" },
                                        ]
                                    }
                                }
                            },
                        }
                    }
                },
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    },
}

module.exports = { updateContractSchema, getContractSchema, addAccessSchema, removeAccessSchema, getAccessSchema, getUsersSchema, getAllWhitelistSchema }