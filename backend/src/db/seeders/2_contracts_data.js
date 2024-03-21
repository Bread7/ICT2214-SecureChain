/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('contracts').del()
  await knex('contracts').insert([
    {id: 1, user_id: 1, transaction_hash: "0xd49243f755a3c3a125ddf548e0392ee081e3792874f0fb37a83493605f1e86ed", deployment_address: "0x62457E1829044F9EF5f509Cddd73eDb371549801", contract_type: "user"},
    {id: 2, user_id: 2, transaction_hash: "0x1f792b51af31b2e2486f790391bd85d6a5555429f7f043e491debbe685c9007d", deployment_address: "0xF2dD1B5482Bcd66d681468585fB42F854BeD710E", contract_type: "user"},
    {id: 3, user_id: 3, transaction_hash: "0xe27439810c0598050181750d7827a7f01a3b2ed5cd1edb2d228ce8961647f0b0", deployment_address: "0x267692d4E8aDb90393063249C9f0cecFCE4e04B8", contract_type: "user"},
    {id: 4, user_id: 4, transaction_hash: "0x2b4ac4264b6825484f371626e17cef10a1d7efa10d25694656bc920fb0a2bc64", deployment_address: "0xe56A3fc8DeCA37751aF3cF011003adcb4d8C012F", contract_type: "owner"},
  ]);
};
