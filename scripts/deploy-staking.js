const hre = require("hardhat");

async function main() {
  const SHACKO_NFT = process.env.SHACKO_NFT_ADDRESS;
  const ASS_TOKEN = process.env.ASS_TOKEN_ADDRESS;

  if (!SHACKO_NFT || !ASS_TOKEN) {
    throw new Error("Missing contract addresses in .env");
  }

  console.log("Deploying Staking Contract...");
  console.log("SHACKO NFT:", SHACKO_NFT);
  console.log("$ASS Token:", ASS_TOKEN);

  const ShackoStaking = await hre.ethers.getContractFactory("ShackoStaking");
  const staking = await ShackoStaking.deploy(SHACKO_NFT, ASS_TOKEN);
  await staking.waitForDeployment();

  const address = await staking.getAddress();
  console.log("✅ Staking Contract deployed to:", address);
  
  // Verify on Basescan
  console.log("Waiting for block confirmations...");
  await staking.deploymentTransaction().wait(5);
  
  console.log("Verifying contract on Basescan...");
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: [SHACKO_NFT, ASS_TOKEN],
  });
  
  console.log("✅ Contract verified!");
  
  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Add staking contract as minter:");
  console.log(`   assToken.addMinter("${address}")`);
  console.log("2. Update .env with STAKING_CONTRACT_ADDRESS");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });