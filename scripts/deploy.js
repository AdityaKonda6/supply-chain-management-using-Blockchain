const hre = require("hardhat");

async function main() {
  try {
    // Get the contract factory
    const Tracking = await hre.ethers.getContractFactory("Tracking");
    
    // Deploy the contract
    const tracking = await Tracking.deploy();
    
    // Wait for deployment to finish
    await tracking.deployed();
    
    console.log("Contract deployed to:", tracking.address);
  } catch (error) {
    console.error("Deployment error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });