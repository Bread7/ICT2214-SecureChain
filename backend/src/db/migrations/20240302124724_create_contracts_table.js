/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("contracts", function(table) {
        table.increments("id").unique().notNullable();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("id").inTable("credentials");
        table.string("transaction_hash");
        table.string("deployment_address");
        table.string("contract_type");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("contracts");
};
