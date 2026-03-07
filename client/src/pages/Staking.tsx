import { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther } from 'viem';
import { FloatingSharks } from "@/components/FloatingSharks";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { ComicButton } from "@/components/ui/comic-button";
import { motion } from "framer-motion";
import logoImage from "@assets/logo-shark.png";

// Contract addresses (update after deployment)
const SHACKO_NFT = '0x12940C944f56273EA27BA3271A4E7B04db426ca7';
const STAKING_CONTRACT = '0xYourStakingContractAddress'; // ← Update after deployment
const XSHACK_TOKEN = '0xYourXShackTokenAddress'; // ← Update after deployment

// ABIs
const NFT_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function setApprovalForAll(address operator, bool approved)',
]);

const STAKING_ABI = parseAbi([
  'function stake(uint256 tokenId, uint8 duration) payable',
  'function unstake(uint256 tokenId)',
  'function emergencyUnstake(uint256 tokenId) payable',
  'function claimRewards(uint256 tokenId)',
  'function getUserStakes(address user) view returns (uint256[])',
  'function getStakeInfo(uint256 tokenId) view returns (address owner, uint256 stakedAt, uint256 unlockTime, uint256 pendingRewards, bool isStaked, string rarity)',
  'function stakeFee() view returns (uint256)',
  'function emergencyUnstakeFee() view returns (uint256)',
]);

const XSHACK_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
]);

export default function Staking() {
  const { address, isConnected } = useAccount();
  const [selectedDuration, setSelectedDuration] = useState(0); // 0=7days, 1=14days, 2=30days, 3=60days

  // Read user's NFT balance
  const { data: nftBalance } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Check if contract is approved
  const { data: isApproved } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'isApprovedForAll',
    args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  // Get user's staked NFTs
  const { data: stakedNFTs } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'getUserStakes',
    args: address ? [address] : undefined,
  });

  // Get xSHACK balance
  const { data: xShackBalance } = useReadContract({
    address: XSHACK_TOKEN,
    abi: XSHACK_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get stake fee
  const { data: stakeFee } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'stakeFee',
  });

  // Write functions
  const { writeContract: approveContract, data: approveHash } = useWriteContract();
  const { writeContract: stakeNFT, data: stakeHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking } = useWaitForTransactionReceipt({ hash: stakeHash });

  const handleApprove = () => {
    approveContract({
      address: SHACKO_NFT,
      abi: NFT_ABI,
      functionName: 'setApprovalForAll',
      args: [STAKING_CONTRACT, true],
    });
  };

  const handleStake = (tokenId) => {
    stakeNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [BigInt(tokenId), selectedDuration],
      value: stakeFee || BigInt(0.5 * 1e18), // 0.5 BASE
    });
  };

  const durations = [
    { days: 7, multiplier: '1.0x', label: '7 DAYS' },
    { days: 14, multiplier: '1.25x', label: '14 DAYS' },
    { days: 30, multiplier: '1.5x', label: '30 DAYS' },
    { days: 60, multiplier: '2.0x', label: '60 DAYS' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc]">
      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <img src={logoImage} alt="Shacko Logo" className="w-12 h-12" />
            <span className="text-3xl font-[Bangers] text-white text-stroke">SHACKO</span>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-[Bangers] text-white text-center mb-8 text-stroke"
          >
            STAKE YOUR SHACKO
          </motion.h1>

          {!isConnected ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center bg-white border-4 border-black rounded-3xl p-12 comic-shadow max-w-2xl mx-auto"
            >
              <p className="text-3xl font-[Bangers] text-[#0ea5e9] mb-8">
                CONNECT YOUR WALLET TO START STAKING
              </p>
              <ConnectButton />
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
                  <p className="text-lg font-[Fredoka] text-gray-600 mb-2">Your NFTs</p>
                  <p className="text-5xl font-[Bangers] text-[#0ea5e9]">
                    {nftBalance ? nftBalance.toString() : '0'}
                  </p>
                </div>
                
                <div className="bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
                  <p className="text-lg font-[Fredoka] text-gray-600 mb-2">Staked NFTs</p>
                  <p className="text-5xl font-[Bangers] text-[#ec4899]">
                    {stakedNFTs ? stakedNFTs.length : '0'}
                  </p>
                </div>
                
                <div className="bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
                  <p className="text-lg font-[Fredoka] text-gray-600 mb-2">xSHACK Balance</p>
                  <p className="text-5xl font-[Bangers] text-[#10b981]">
                    {xShackBalance ? Math.floor(Number(formatEther(xShackBalance))) : '0'}
                  </p>
                </div>
              </div>

              {/* Approval */}
              {!isApproved && nftBalance && Number(nftBalance) > 0 && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-yellow-100 border-4 border-black rounded-2xl p-8 comic-shadow"
                >
                  <h3 className="text-3xl font-[Bangers] text-[#0ea5e9] mb-4">
                    ⚡ APPROVAL REQUIRED
                  </h3>
                  <p className="text-lg font-[Fredoka] mb-6">
                    You need to approve the staking contract to interact with your NFTs.
                    This is a one-time transaction.
                  </p>
                  <ComicButton
                    onClick={handleApprove}
                    disabled={isApproving}
                    size="lg"
                  >
                    {isApproving ? 'APPROVING...' : 'APPROVE CONTRACT'}
                  </ComicButton>
                </motion.div>
              )}

              {/* Duration Selector */}
              {isApproved && (
                <div>
                  <h2 className="text-4xl font-[Bangers] text-white text-center mb-6 text-stroke">
                    CHOOSE STAKING DURATION
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {durations.map((duration, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDuration(index)}
                        className={`p-6 rounded-2xl border-4 border-black font-[Bangers] text-2xl transition-all ${
                          selectedDuration === index
                            ? 'bg-[#ec4899] text-white scale-105 comic-shadow-lg'
                            : 'bg-white text-black hover:scale-105 comic-shadow'
                        }`}
                      >
                        <div>{duration.label}</div>
                        <div className="text-sm opacity-75">{duration.multiplier} Bonus</div>
                      </button>
                    ))}
                  </div>

                  <div className="text-center bg-white border-4 border-black rounded-2xl p-6 comic-shadow">
                    <p className="text-xl font-[Fredoka] text-gray-600">
                      💰 Stake Fee: <span className="font-bold text-[#0ea5e9]">0.5 BASE</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Coming Soon Placeholder */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-4 border-black rounded-3xl p-12 comic-shadow text-center"
              >
                <p className="text-6xl mb-4">🦈</p>
                <h3 className="text-4xl font-[Bangers] text-[#0ea5e9] mb-4">
                  NFT GALLERY COMING SOON
                </h3>
                <p className="text-xl font-[Fredoka] text-gray-600">
                  Your SHACKO NFTs will appear here once we finish the UI!
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}