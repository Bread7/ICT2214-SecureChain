/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("credentials").del()
  await knex("credentials").insert([
    {id: 1, username: "test1", password: "$argon2id$v=19$m=65536,t=3,p=4$fHkTMKuRVKTUuvY2pTizWw$qlKFVyEbWyfIJwOv6sjJh7FdFzVo1W/1kZnL4LTfDOI", wallet_address: "0x70edD58554b1aF727377e542E5DE046B41cd6351"},
    {id: 2, username: "bob", password: "$argon2id$v=19$m=65536,t=3,p=4$9G/GrZf/DXBKWef5FhIqOg$5//ITpxhUg+ymRkwB1CxaExqoCoxTJ/CI6Z5uQxGj4g", wallet_address: "0x70edD58554b1aF727377e542E5DE046B41cd6351"},
    {id: 3, username: "bobbby", password: "$argon2id$v=19$m=65536,t=3,p=4$OO6xLrqZ/Qc/4FKNwn5IhA$lEKmiQ15xrFUVtBAbJkzz9btVbMdr2kes1mR7gSs5Lk", wallet_address: "0x70edD58554b1aF727377e542E5DE046B41cd6351"},
    {id: 4, username: "admin", password: "$argon2id$v=19$m=65536,t=3,p=4$52yJF6aNCUjGO3MJS55EyQ$B+vLAEXeftTLPxPPkO9yAov0Ob3EyIwm8ghJ7JOVU8A", wallet_address: "0x3f8c26f31555dc20619923b3efc24851059be4f9"},
  ]);
};
