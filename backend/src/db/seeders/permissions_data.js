/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("permissions").del()
  await knex("permissions").insert([
    {id: 1, attribute_index: "10", attribute: "home"},
    {id: 2, attribute_index: "20", attribute: "finance"},
    {id: 3, attribute_index: "21", attribute: "add-finance"},
  ]);
};
