const hre = require("hardhat");

async function main() {
  console.log("Deploying $SHACK Token...");

  const ASSToken = await hre.ethers.getContractFactory("ASSToken");
  const shackToken = await SHACKToken.deploy();
  await shackToken.waitForDeployment();

  const address = await shackToken.getAddress();
  console.log("✅ $SHACK Token deployed to:", address);
  
  // Verify on Basescan
  console.log("Waiting for block confirmations...");
  await assToken.deploymentTransaction().wait(5);
  
  console.log("Verifying contract on Basescan...");
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: [],
  });
  
  console.log("✅ Contract verified!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });