// Database initialisation
const knexfile = require("./config/knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(knexfile);

module.exports = knex;