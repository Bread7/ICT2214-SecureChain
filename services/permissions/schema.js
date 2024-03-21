const getPermissionsSchema = {
    summary: "Returns all permissions data",
    description: "\>Gets all permissions data with no specfic indexing",
    tags: ["permissions"],
    response: {
        200: {
            type: "object",
            description: "Format of successful and correct API response",
            properties: {
                data: { 
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            attribute_index: { type: "string" },
                            attribute: { type: "string" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: "string", format: "date-time" },
                        },
                    },
                    minItems: 1,
                    maxItems: 5,
                },
                success: { type: "boolean" },
                msg: { type: "string" },
            }
        },
    }
}

const postPermissionsSchema = {
    summary: "Post permissions data",
    description: "\>Post permissions data set into database.",
    tags: ["permissions"],
    body: {
        description: "Post a singular permissions data set into database. Multiple insertions require multiple function calls. All params need to be filled.",
        required: ["attribute", "attribute_index"],
        type: "object",
        properties: {
            attribute_index: { type: "string" },
            attribute: { type: "string" },
        },
        "x-examples": {
            "Sending permissions data": {
                description: "This is an example request",
                value: {
                    attribute_index: "100",
                    attribute: "mario",
                }
            },
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

const deletePermissionsSchema = {
    summary: "Remove permissions data",
    description: "\>Remove a permission entry from the database.",
    tags: ["permissions"],
    body: {
        description: "Remove permission entry from database based on supplied `id`. Multiple deletions require multiple function calls. All params need to be filled.",
        required: ["id"],
        type: "object",
        properties: {
            id: { type: "number" },
        },
        "x-examples": {
            "Removing permissions data": {
                description: "This is an example request",
                value: {
                    id: 3,
                },
            },
        },
    },
    response: {
        200: {
            description: "Format of successful and correct API response",
            type: "object",
            properties: {
                success: { type: "boolean" },
                msg: { type: "string" },
            },
        },
    },
}

module.exports = { getPermissionsSchema, postPermissionsSchema, deletePermissionsSchema }