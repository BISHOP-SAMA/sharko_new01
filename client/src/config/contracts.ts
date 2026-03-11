// Deployed Contract Addresses - Base Sepolia Testnet
export const CONTRACTS = {
  // Test NFT Contract
  NFT_ADDRESS: "0x88670d32A2646973895AA1C111d24ee18A585007" as `0x${string}`,
  
  // xSHACK Token  
  XSHACK_ADDRESS: "0xDF90DefD06AFBdD8a80E546677DFe2df66D418dc" as `0x${string}`,
  
  // Staking Contract
  STAKING_ADDRESS: "0x4Bf7a99A9D0583B3bc68Ca9480639B59d1E4A787" as `0x${string}`,
  
  // Treasury Wallet
  TREASURY_ADDRESS: "0xc1e4c27A2E20EA7C6966F6945738171EEeEf5FC7" as `0x${string}`,
  
  // Network
  CHAIN_ID: 84532, // Base Sepolia
  CHAIN_NAME: "Base Sepolia",
};

// Duration enum matching the smart contract
export enum StakeDuration {
  SEVEN = 0,
  FOURTEEN = 1,
  THIRTY = 2,
  SIXTY = 3,
}

// Stake fees (in wei)
export const STAKE_FEE = "500000000000000"; // 0.0005 ETH
export const EMERGENCY_UNSTAKE_FEE = "1000000000000000"; // 0.001 ETH