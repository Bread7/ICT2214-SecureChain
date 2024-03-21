# Solidity 

## Using blockchain for access control

This repo is just a simple repository to test if blockchain can be used to create smart contracts for access control possibility.

## Setup

Adjust hardhat.config.js accordingly to the network you plan to use
Copy `.env.example` into `.env` and add in the necessary wallet, private key and blockchain environment details

## Commands to run

`npm compile` (need to run to generate ABI files based on Smart Contract which is needed when deploying to blockchain environment)
`npm test`
`npx hardhat run --network <based on your hardhat config network name> scripts/<script filename>.js`

## There is an option to deploy contract on local hardhat simulated blockchain environment

`npm node`
`npx hardhat run --network localhost scripts/<script filename>.js`