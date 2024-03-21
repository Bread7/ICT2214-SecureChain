"use strict"

const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../../../.env")
})

module.exports = {
    development: {
        client: process.env.DB_DIALECT,
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        migrations: {
            directory: path.join(__dirname, "/../migrations")
        },
        seeds: {
            directory: path.join(__dirname, "/../seeders")
        },
        debug: true
    }
}