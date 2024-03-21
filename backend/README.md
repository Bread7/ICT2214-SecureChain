# SecureChain
Web Security Innovative Project

## Dependencies

1. MySQL
2. Nodejs
3. Solidity
4. Metamask wallet

- Notes for using `npm`: use `npx` to execute any javascript files/modules/commands. Replace `pnpm` with `npx`. If `yarn`, can continue to use `yarn`.

## Start DB Services

### MacOS
`mysql.server start` 

## Setup Hardhat Smart Contract on Polygon Testnet

### Compile Contracts

IMPORTANT: any changes made to any solidity files will require a recompile otherwise changes will be based on the old ABI compilation.

`pnpm compile` or `pnpm hardhat compile`

### Test Contracts (optional)

`pnpm test` or `pnpm hardhat --network hardhat test`

### Deploy Contracts (optional)

Refer to `hardhat.config.js` for the networks

`pnpm hardhat run --network <blockchain network> scripts/<contract to deploy>.js`

### Config Notes

If using testnet online (e.g. alchemy, quicknode to Polygon Mumbai testnet), make sure to adjust `hardhat.config.js` in backend to reflect changes

Otherwise can use `pnpm hardhat node` and use localhost for testing and adjust `hardhat.config.js` to localhost

## Setup Backend Services

### Install node packages

Default is npm unless you have installed pnpm, then use pnpm.
Both are interchangable.
`npm install` or `pnpm install`

### MySQL migrations and seeders for initialisation

Make sure to create a database named `web` (or any database name you want) inside mysql first, then supplement details into .env file

### Run Migrations

Run from root directory of repository
`pnpm migrate:latest`
 or
`./node_modules/knex/bin/cli.js --migrations-directory path/to/migrations/dir --knexfile path/to/knexfile migrate:latest`

### Run Seeders

Run from root directory of repository
`pnpm seed:run`
or
`./node_modules/knex/bin/cli.js --knexfile path/to/knexfile seed:run`

### Start Backend Services

Run the application locally
`pnpm start`


### See Backend APIs Documentation

Go to `http://127.0.0.1:3001/docs` or [click this link](http://127.0.0.1:3001/docs)

## Database Development

### Create Migrations

Run from root directory of repository
`pnpm migrate:make <filename>`
or
`./node_modules/knex/bin/cli.js --migrations-directory path/to/migrations/dir migrate:make <filename>`

### Create Seeders

Run from root directory of repository
`pnpm seed:make <filename>`
or
`./node_modules/knex/bin/cli.js --knexfile path/to/knexfile seed:make <filename>`

## References

[Install mysql on MacOS](https://medium.com/@rodolfovmartins/how-to-install-mysql-on-mac-959df86a5319)
https://github.com/rob-Hitchens/UnorderedKeySet
