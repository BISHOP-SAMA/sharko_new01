const hre = require("hardhat");

async function main() {
  const SHACKO_NFT = process.env.SHACKO_NFT_ADDRESS;
  const XSHACK_TOKEN = process.env.XSHACK_TOKEN_ADDRESS;
  const TREASURY_WALLET = process.env.TREASURY_WALLET_ADDRESS;

  // Validate addresses
  if (!SHACKO_NFT || !XSHACK_TOKEN || !TREASURY_WALLET) {
    console.error("❌ ERROR: Missing required addresses in .env file!");
    console.log("\nRequired environment variables:");
    console.log("- SHACKO_NFT_ADDRESS:", SHACKO_NFT || "❌ MISSING");
    console.log("- XSHACK_TOKEN_ADDRESS:", XSHACK_TOKEN || "❌ MISSING");
    console.log("- TREASURY_WALLET_ADDRESS:", TREASURY_WALLET || "❌ MISSING");
    process.exit(1);
  }

  console.log("🚀 Deploying Shacko Staking Contract...");
  console.log("\n" + "=".repeat(60));
  console.log("CONFIGURATION");
  console.log("=".repeat(60));
  console.log("SHACKO NFT:", SHACKO_NFT);
  console.log("xSHACK Token:", XSHACK_TOKEN);
  console.log("Treasury Wallet:", TREASURY_WALLET);
  console.log("=".repeat(60));

  const ShackoStaking = await hre.ethers.getContractFactory("ShackoStaking");
  const staking = await ShackoStaking.deploy(
    SHACKO_NFT,
    XSHACK_TOKEN,
    TREASURY_WALLET
  );
  await staking.waitForDeployment();

  const address = await staking.getAddress();
  console.log("\n✅ Staking Contract deployed to:", address);
  
  console.log("\n⏳ Waiting for block confirmations...");
  await staking.deploymentTransaction().wait(5);
  
  console.log("\n🔍 Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [SHACKO_NFT, XSHACK_TOKEN, TREASURY_WALLET],
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Contract: Shacko Staking");
  console.log("Address:", address);
  console.log("Network:", hre.network.name);
  console.log("Stake Fee: 0.5 BASE");
  console.log("Emergency Unstake Fee: 1.0 BASE");
  console.log("=".repeat(60));
  
  console.log("\n💾 NEXT STEPS:");
  console.log("1. Add this to your .env file:");
  console.log(`   STAKING_CONTRACT_ADDRESS=${address}`);
  console.log("\n2. Authorize staking contract to mint xSHACK:");
  console.log("   Run: npm run authorize:minter");
  console.log("\n3. Set NFT rarities:");
  console.log("   Run: npm run set:rarities");
  
  console.log("\n💰 REVENUE INFO:");
  console.log(`All fees will be sent to: ${TREASURY_WALLET}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });