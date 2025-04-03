require("@nomicfoundation/hardhat-toolbox");

// You can use a .env file for better security
// require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Default Ganache URL (adjust if different)
      // Instead of using a mnemonic, use a private key from your Ganache instance
      accounts: [
        "68752df3a213b9d4570e370801b8ccddbe2d5a6eb02c161e278e13570c73275c"
      ]
    },
  },
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test"
  },
};
