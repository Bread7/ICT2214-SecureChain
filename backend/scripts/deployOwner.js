const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account: ", deployer.address);

    const owner = await hre.ethers.deployContract("Owner", ["tester"]);
    await owner.waitForDeployment();

    console.log("Contract deployed at: ", await owner.getAddress());
    console.log("Transaction address = ", await owner.deploymentTransaction());

    // console.log("Owner address: ", await owner.getownerOwner());
}

// Returns the deployed contract back
// Make sure to used the return value and store the details
// Uses specific private key to deploy
async function deployOwnerWithPrivateKey(name, accountPrivateKey) {
    // Modify the config code to suit deployment based on different wallet addresses
    // Clear out the private keys
    if (hre.network.name != "localhost") {
        hre.network.config.accounts = [];
        hre.network.config.accounts.push("0x" + accountPrivateKey);
    }
    const owner = await hre.ethers.deployContract("Owner", [name]);
    // await owner.waitForDeployment();
    return owner;
}

// Use default owner private key to deploy address
async function deployOwner(name) {
    // Modify the config code to suit deployment based on different wallet addresses
    // Clear out the private keys
    if (hre.network.name != "localhost") {
        hre.network.config.accounts = [];
        hre.network.config.accounts.push("0x" + process.env.OWNER_PRIVATE_KEY); 
    }
    // console.log(hre.network)
    const owner = await hre.ethers.deployContract("Owner", [name]);
    // await user.waitForDeployment();
    return owner;
}


module.exports = { deployOwner, deployOwnerWithPrivateKey };

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// Uncomment the code below to use as standalone script
//
// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   });