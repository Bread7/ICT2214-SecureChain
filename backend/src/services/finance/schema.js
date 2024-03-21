const getFinanceSchema = {
    summary: "Returns all finance data",
    description: "\>Gets all finance data with no specfic indexing",
    tags: ["finance"],
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
                            balance: { type: "number" },
                            profits: { type: "number" },
                            revenue: { type: "number" },
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

const postFinanceSchema = {
    summary: "Post finance data",
    description: "\>Post dummy finance data set into database.",
    tags: ["finance"],
    body: {
        description: "Post a singular finance data set into database. Multiple insertions require multiple function calls. All params need to be filled.",
        required: ["balance", "profits", "revenue"],
        type: "object",
        properties: {
            balance: { type: "number" },
            profits: { type: "number" },
            revenue: { type: "number" },
        },
        "x-examples": {
            "Sending finance data": {
                description: "This is an example request",
                value: {
                    balance: 20,
                    profits: 20,
                    revenue: 40
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

module.exports = { getFinanceSchema, postFinanceSchema }