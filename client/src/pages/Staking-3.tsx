"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState } from "react";
import { Wallet, Lock, Unlock, Trophy, TrendingUp, Clock, Zap } from "lucide-react";

// Contract addresses (UPDATE AFTER DEPLOYMENT)
const SHACKO_NFT = '0x12940C944f56273EA27BA3271A4E7B04db426ca7';
const STAKING_CONTRACT = '0xYourStakingContractAddress';
const XSHACK_TOKEN = '0xYourXShackTokenAddress';

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
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);

  // Read user's NFT balance
  const { data: nftBalance } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Check if approved
  const { data: isApproved } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'isApprovedForAll',
    args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  // Get staked NFTs
  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({
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
  const { writeContract: unstakeNFT, data: unstakeHash } = useWriteContract();
  const { writeContract: claimNFT, data: claimHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isUnstaking } = useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({ hash: claimHash });

  const handleApprove = () => {
    approveContract({
      address: SHACKO_NFT,
      abi: NFT_ABI,
      functionName: 'setApprovalForAll',
      args: [STAKING_CONTRACT, true],
    });
  };

  const handleStake = () => {
    if (selectedNFT === null) return;
    
    stakeNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [BigInt(selectedNFT), selectedDuration],
      value: stakeFee || parseEther('0.5'),
    });
    
    setShowStakeModal(false);
    setTimeout(() => refetchStaked(), 2000);
  };

  const handleUnstake = (tokenId: number) => {
    unstakeNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [BigInt(tokenId)],
    });
    
    setTimeout(() => refetchStaked(), 2000);
  };

  const handleClaim = (tokenId: number) => {
    claimNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'claimRewards',
      args: [BigInt(tokenId)],
    });
  };

  const durations = [
    { days: 7, multiplier: '1.0x', label: '7 DAYS', icon: Zap },
    { days: 14, multiplier: '1.25x', label: '14 DAYS', icon: TrendingUp },
    { days: 30, multiplier: '1.5x', label: '30 DAYS', icon: Trophy },
    { days: 60, multiplier: '2.0x', label: '60 DAYS', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Header />

      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {!isConnected ? (
            // NOT CONNECTED VIEW
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1
                  className="text-[15vw] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] leading-none mb-8"
                  style={{
                    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                    WebkitTextStroke: "2px rgba(251, 191, 36, 0.3)",
                  }}
                >
                  STAKING
                </h1>
                <p className="text-2xl md:text-3xl text-gray-300 font-bold mb-12">
                  Connect your wallet to start earning xSHACK rewards
                </p>
              </motion.div>

              {/* Connect Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-4 border-black rounded-3xl p-12 text-center shadow-2xl"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] flex items-center justify-center mx-auto mb-8 border-4 border-black">
                  <Wallet size={48} className="text-white" />
                </div>
                
                <h2
                  className="text-5xl md:text-6xl font-black text-white mb-6"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  CONNECT WALLET
                </h2>
                
                <p className="text-xl text-gray-300 font-semibold mb-10 max-w-2xl mx-auto">
                  Connect your wallet to view your SHACKO NFTs and start staking to earn xSHACK rewards
                </p>

                <div className="flex justify-center">
                  <ConnectButton.Custom>
                    {({ account, chain, openConnectModal, mounted }) => {
                      return (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={openConnectModal}
                          className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-12 py-6 rounded-full font-black text-2xl border-4 border-black shadow-lg hover:shadow-2xl transition-all"
                          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                        >
                          CONNECT WALLET
                        </motion.button>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </motion.div>
            </div>
          ) : (
            // CONNECTED VIEW - STAKING DASHBOARD
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1
                  className="text-[12vw] md:text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] leading-none mb-6"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  STAKING DASHBOARD
                </h1>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              >
                {/* xSHACK Balance */}
                <div className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] border-4 border-black rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                      <Trophy size={28} className="text-white" />
                    </div>
                    <h3
                      className="text-2xl font-black text-white"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      xSHACK Balance
                    </h3>
                  </div>
                  <p className="text-5xl font-black text-white">
                    {xShackBalance ? Math.floor(Number(formatEther(xShackBalance))) : '0'}
                  </p>
                </div>

                {/* Total NFTs */}
                <div className="bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] border-4 border-black rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                      <Wallet size={28} className="text-white" />
                    </div>
                    <h3
                      className="text-2xl font-black text-white"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      Total NFTs
                    </h3>
                  </div>
                  <p className="text-5xl font-black text-white">
                    {nftBalance ? Number(nftBalance) : 0}
                  </p>
                </div>

                {/* Staked NFTs */}
                <div className="bg-gradient-to-br from-[#10b981] to-[#14b8a6] border-4 border-black rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                      <Lock size={28} className="text-white" />
                    </div>
                    <h3
                      className="text-2xl font-black text-white"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      Staked NFTs
                    </h3>
                  </div>
                  <p className="text-5xl font-black text-white">
                    {stakedNFTs ? stakedNFTs.length : 0}
                  </p>
                </div>
              </motion.div>

              {/* Staked NFTs Section */}
              {stakedNFTs && stakedNFTs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <h2
                    className="text-5xl md:text-6xl font-black text-white mb-8"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    YOUR STAKED SHACKOS
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stakedNFTs.map((tokenId) => (
                      <StakedNFTCard
                        key={Number(tokenId)}
                        tokenId={Number(tokenId)}
                        onUnstake={handleUnstake}
                        onClaim={handleClaim}
                        isUnstaking={isUnstaking}
                        isClaiming={isClaiming}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Stake New NFT Section */}
              {nftBalance && Number(nftBalance) > 0 ? (
                !isApproved ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#ec4899] to-[#f97316] border-4 border-black rounded-3xl p-10 text-center shadow-2xl"
                  >
                    <h2
                      className="text-5xl font-black text-white mb-6"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      APPROVE STAKING CONTRACT
                    </h2>
                    <p className="text-xl text-white/90 font-semibold mb-8 max-w-2xl mx-auto">
                      Before staking, you need to approve the staking contract to manage your NFTs
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="bg-black text-white px-12 py-6 rounded-full font-black text-2xl border-4 border-white shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      {isApproving ? 'APPROVING...' : 'APPROVE CONTRACT'}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-4 border-black rounded-3xl p-10 text-center shadow-2xl"
                  >
                    <h2
                      className="text-5xl font-black text-white mb-6"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      STAKE YOUR SHACKOS
                    </h2>
                    <p className="text-xl text-gray-300 font-semibold mb-8">
                      Select an NFT and duration to start earning xSHACK rewards
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowStakeModal(true)}
                      className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-12 py-6 rounded-full font-black text-2xl border-4 border-black shadow-lg hover:shadow-2xl transition-all"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      STAKE NFT
                    </motion.button>
                  </motion.div>
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-4 border-black rounded-3xl p-16 text-center shadow-2xl"
                >
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border-4 border-white/20">
                    <Wallet size={48} className="text-white/60" />
                  </div>
                  <h3
                    className="text-4xl font-black text-white/60 mb-4"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    NO SHACKO NFTs FOUND
                  </h3>
                  <p className="text-xl text-gray-400 font-semibold">
                    You need SHACKO NFTs to start staking
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Stake Modal */}
      <AnimatePresence>
        {showStakeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowStakeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] rounded-3xl border-4 border-black shadow-2xl max-w-2xl w-full p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] mb-8"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                STAKE YOUR SHACKO
              </h2>
              
              <div className="mb-8">
                <label className="block text-xl font-bold text-white mb-3">Token ID</label>
                <input
                  type="number"
                  value={selectedNFT || ''}
                  onChange={(e) => setSelectedNFT(Number(e.target.value))}
                  placeholder="Enter NFT Token ID"
                  className="w-full h-16 rounded-xl border-4 border-black bg-white px-6 text-xl font-bold"
                />
              </div>

              <div className="mb-8">
                <label className="block text-xl font-bold text-white mb-4">Choose Duration</label>
                <div className="grid grid-cols-2 gap-4">
                  {durations.map((duration, index) => {
                    const Icon = duration.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDuration(index)}
                        className={`p-6 rounded-2xl border-4 border-black font-black text-xl transition-all ${
                          selectedDuration === index
                            ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black scale-105 shadow-2xl'
                            : 'bg-white text-black hover:scale-105'
                        }`}
                      >
                        <Icon size={32} className="mx-auto mb-3" />
                        <div className="text-2xl mb-1" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                          {duration.label}
                        </div>
                        <div className="text-sm opacity-75">{duration.multiplier} Bonus</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 border-2 border-[#fbbf24] rounded-2xl p-6 mb-8 text-center">
                <p className="text-xl font-bold text-white">
                  Stake Fee: 0.5 BASE ETH
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 bg-white/10 backdrop-blur-sm text-white px-6 py-5 rounded-xl font-black text-xl border-4 border-white/20 hover:scale-105 transition-transform"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleStake}
                  disabled={selectedNFT === null || isStaking}
                  className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-6 py-5 rounded-xl font-black text-xl border-4 border-black hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  {isStaking ? 'STAKING...' : 'STAKE NOW'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// Staked NFT Card Component
function StakedNFTCard({ 
  tokenId, 
  onUnstake, 
  onClaim,
  isUnstaking,
  isClaiming 
}: { 
  tokenId: number;
  onUnstake: (id: number) => void;
  onClaim: (id: number) => void;
  isUnstaking: boolean;
  isClaiming: boolean;
}) {
  const { data: stakeInfo } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [BigInt(tokenId)],
  });

  if (!stakeInfo) return null;

  const [owner, stakedAt, unlockTime, pendingRewards, isStaked, rarity] = stakeInfo;
  const now = Date.now() / 1000;
  const isUnlocked = Number(unlockTime) <= now;
  const daysLeft = Math.max(0, Math.ceil((Number(unlockTime) - now) / 86400));

  const rarityColors: Record<string, string> = {
    'Common': 'from-gray-400 to-gray-600',
    'Uncommon': 'from-green-400 to-green-600',
    'Rare': 'from-blue-400 to-blue-600',
    'Epic': 'from-purple-400 to-purple-600',
    'Legendary': 'from-yellow-400 to-orange-500',
    'OneOfOne': 'from-pink-400 to-red-500',
  };

  return (
    <div className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-4 border-black rounded-3xl p-6 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p
            className="text-3xl font-black text-white mb-2"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            SHACKO #{tokenId}
          </p>
          <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${rarityColors[rarity] || rarityColors.Common} border-2 border-black`}>
            {rarity}
          </span>
        </div>
        <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
          <p className="text-sm text-gray-400 font-semibold mb-1">Rewards</p>
          <p className="text-3xl font-black text-[#10b981]">
            {Math.floor(Number(formatEther(pendingRewards)))}
          </p>
          <p className="text-sm text-gray-400 font-semibold">xSHACK</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {isUnlocked ? (
            <Unlock size={20} className="text-[#10b981]" />
          ) : (
            <Lock size={20} className="text-[#fbbf24]" />
          )}
          <p className="text-sm text-gray-300 font-bold">
            {isUnlocked ? 'Unlocked' : `${daysLeft} days remaining`}
          </p>
        </div>
        <div className="w-full bg-black/40 rounded-full h-4 border-2 border-white/20">
          <div 
            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] h-full rounded-full transition-all"
            style={{ width: `${isUnlocked ? 100 : Math.min(100, ((now - Number(stakedAt)) / (Number(unlockTime) - Number(stakedAt))) * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onClaim(tokenId)}
          disabled={Number(pendingRewards) === 0 || isClaiming}
          className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white px-4 py-4 rounded-xl font-black border-4 border-black hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          {isClaiming ? 'CLAIMING...' : 'CLAIM'}
        </button>
        <button
          onClick={() => onUnstake(tokenId)}
          disabled={!isUnlocked || isUnstaking}
          className="flex-1 bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white px-4 py-4 rounded-xl font-black border-4 border-black hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          {isUnstaking ? 'UNSTAKING...' : 'UNSTAKE'}
        </button>
      </div>
    </div>
  );
}
