/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("finance").del()
  await knex("finance").insert([
    {id: 1, balance: 1000, profits: 1000, revenue: 2000},
    {id: 2, balance: 2000, profits: 2000, revenue: 4000},
    {id: 3, balance: 3000, profits: 3000, revenue: 6000},
  ]);
};
