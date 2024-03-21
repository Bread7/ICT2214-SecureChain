const getHomeSchema = {
    summary: "Returns all home data",
    description: "\>Gets all home data with no specific indexing",
    tags: ["home"],
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
                            header: { type: "string" },
                            content: {type: "string" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: "string", format: "date-time" },
                        }
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

const postHomeSchema = {
    summary: "Post home data",
    description: "\>Post dummy home data into database",
    tags: ["home"],
    body: {
        description: "Post a singular finance data set into database. Multiple insertions require multiple function calls. All params need to be filled.",
        required: ["header", "content"],
        type: "object",
        properties: {
            header: { type: "string" },
            content: { type: "string" },
        },
        "x-examples": {
            "Sending home data": {
                description: "This is an example request",
                value: {
                    header: "heading 1",
                    content: "content 1",
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

module.exports = { getHomeSchema, postHomeSchema }