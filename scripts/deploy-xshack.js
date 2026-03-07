const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying xSHACK Token...");

  const xSHACKToken = await hre.ethers.getContractFactory("xSHACKToken");
  const xShack = await xSHACKToken.deploy();
  await xShack.waitForDeployment();

  const address = await xShack.getAddress();
  console.log("✅ xSHACK Token deployed to:", address);
  
  console.log("\n⏳ Waiting for block confirmations...");
  await xShack.deploymentTransaction().wait(5);
  
  console.log("\n🔍 Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Contract: xSHACK Token (SHACKO XP)");
  console.log("Address:", address);
  console.log("Network:", hre.network.name);
  console.log("Symbol: xSHACK");
  console.log("Transferable: NO (non-transferable)");
  console.log("=".repeat(60));
  
  console.log("\n💾 NEXT STEPS:");
  console.log("1. Add this to your .env file:");
  console.log(`   XSHACK_TOKEN_ADDRESS=${address}`);
  console.log("\n2. Deploy the staking contract:");
  console.log("   npm run deploy:staking:testnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
