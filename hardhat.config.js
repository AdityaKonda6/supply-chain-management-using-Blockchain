require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", 
      chainId: 1337,
      accounts: [
        "28bd005ba11af12e31d90f718ffa9e100e922c9e0ecef7e524868cdfb985d9ea"
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
