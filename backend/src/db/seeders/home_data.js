/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("home").del()
  await knex("home").insert([
    {id: 1, header: "rights", content: "Only those with rights can see this"},
    {id: 2, header: "everyone", content: "Everyone can see this"}
  ]);
};
