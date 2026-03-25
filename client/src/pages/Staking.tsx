"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState } from "react";
import { Wallet, Lock, Trophy, TrendingUp, Clock, Zap, X, AlertTriangle, ChevronRight } from "lucide-react";

const SHACKO_NFT = '0x7f30f4b6d5C98D29E32cf013558A01443c87C013';
const STAKING_CONTRACT = '0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5';
const SHACK_TOKEN = '0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3';

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

const SHACK_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
]);

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  'Common':    { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40' },
  'Uncommon':  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  'Rare':      { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/40' },
  'Epic':      { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40' },
  'Legendary': { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40' },
  'OneOfOne':  { bg: 'bg-rose-500/20',    text: 'text-rose-300',    border: 'border-rose-500/40' },
};

const durationMap: Record<number, { label: string; multiplier: string; mult: number }> = {
  0: { label: '7 Days',  multiplier: '1.0x',  mult: 100 },
  1: { label: '14 Days', multiplier: '1.25x', mult: 125 },
  2: { label: '30 Days', multiplier: '1.5x',  mult: 150 },
  3: { label: '60 Days', multiplier: '2.0x',  mult: 200 },
};

const baseRateMap: Record<string, number> = {
  'Common': 10, 'Uncommon': 15, 'Rare': 20,
  'Epic': 40,   'Legendary': 70, 'OneOfOne': 100,
};

const rarityMultMap: Record<string, number> = {
  'Common': 100, 'Uncommon': 125, 'Rare': 150,
  'Epic': 200,   'Legendary': 300, 'OneOfOne': 500,
};

export default function Staking() {
  const { address, isConnected } = useAccount();
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);

  const closeModal = () => {
    setShowStakeModal(false);
    setSelectedNFT(null);
    setSelectedDuration(0);
  };

  const { data: nftBalance } = useReadContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: isApproved } = useReadContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'isApprovedForAll',
    args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes',
    args: address ? [address] : undefined,
  });

  const { data: xShackBalance } = useReadContract({
    address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: stakeFee } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeFee',
  });

  const { writeContract: approveContract, data: approveHash } = useWriteContract();
  const { writeContract: stakeNFT, data: stakeHash } = useWriteContract();
  const { writeContract: unstakeNFT, data: unstakeHash } = useWriteContract();
  const { writeContract: emergencyUnstakeNFT, data: emergencyUnstakeHash } = useWriteContract();
  const { writeContract: claimNFT, data: claimHash } = useWriteContract();

  const { isLoading: isApproving }          = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking }            = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isUnstaking }          = useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isLoading: isEmergencyUnstaking } = useWaitForTransactionReceipt({ hash: emergencyUnstakeHash });
  const { isLoading: isClaiming }           = useWaitForTransactionReceipt({ hash: claimHash });

  const handleApprove = () => approveContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'setApprovalForAll',
    args: [STAKING_CONTRACT, true],
  });

  const handleStake = () => {
    if (selectedNFT === null || selectedNFT === undefined) return;
    stakeNFT({
      address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stake',
      args: [BigInt(selectedNFT), selectedDuration],
      value: stakeFee || parseEther('0.0001'),
    });
    closeModal();
    setTimeout(() => refetchStaked(), 2000);
  };

  const handleUnstake = (tokenId: number) => {
    unstakeNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(tokenId)] });
    setTimeout(() => refetchStaked(), 2000);
  };

  const handleEmergencyUnstake = (tokenId: number) => {
    emergencyUnstakeNFT({
      address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'emergencyUnstake',
      args: [BigInt(tokenId)], value: parseEther('0.0002'),
    });
    setTimeout(() => refetchStaked(), 2000);
  };

  const handleClaim = (tokenId: number) => claimNFT({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimRewards', args: [BigInt(tokenId)],
  });

  const [isClaimingAll, setIsClaimingAll] = useState(false);
  const handleClaimAll = async () => {
    if (!stakedNFTs || stakedNFTs.length === 0) return;
    setIsClaimingAll(true);
    for (const tokenId of stakedNFTs) {
      claimNFT({
        address: STAKING_CONTRACT, abi: STAKING_ABI,
        functionName: 'claimRewards', args: [BigInt(tokenId)],
      });
      await new Promise((res) => setTimeout(res, 1000));
    }
    setIsClaimingAll(false);
    setTimeout(() => refetchStaked(), 3000);
  };


  const durations = [
    { label: '7 Days',  multiplier: '1.0x',  icon: Zap },
    { label: '14 Days', multiplier: '1.25x', icon: TrendingUp },
    { label: '30 Days', multiplier: '1.5x',  icon: Trophy },
    { label: '60 Days', multiplier: '2.0x',  icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#060b18] overflow-x-hidden">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {!isConnected ? (
            // ── NOT CONNECTED ──────────────────────────────────────────────────
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center mb-6">
                <Wallet size={28} className="text-[#fbbf24]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Stake Your SHACKOs</h1>
              <p className="text-gray-400 mb-8 max-w-sm text-sm">
                Connect your wallet to view your NFTs and start earning SHACK rewards
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="flex items-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    Connect Wallet <ChevronRight size={16} />
                  </button>
                )}
              </ConnectButton.Custom>
            </motion.div>

          ) : (
            // ── DASHBOARD ──────────────────────────────────────────────────────
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Page Title */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Staking Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Stake your SHACKO NFTs to earn SHACK rewards</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'xSHACK Balance', value: ShackBalance ? Math.floor(Number(formatEther(ShackBalance))).toLocaleString() : '0', icon: Trophy, color: 'text-[#fbbf24]', accent: 'bg-[#fbbf24]/10' },
                  { label: 'Total NFTs',     value: nftBalance ? Number(nftBalance).toString() : '0', icon: Wallet, color: 'text-blue-400', accent: 'bg-blue-500/10' },
                  { label: 'Staked NFTs',   value: stakedNFTs ? stakedNFTs.length.toString() : '0', icon: Lock,   color: 'text-emerald-400', accent: 'bg-emerald-500/10' },
                ].map(({ label, value, icon: Icon, color, accent }) => (
                  <div key={label} className="bg-[#0d1525] border border-white/5 rounded-2xl p-4">
                    <div className={`w-8 h-8 rounded-lg ${accent} flex items-center justify-center mb-3`}>
                      <Icon size={15} className={color} />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>


              {/* Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1525] to-[#0a1628] border border-blue-500/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
                {/* Base orb background */}
                <div className="absolute right-0 top-0 w-48 h-48 opacity-10 pointer-events-none">
                  <img src="/assets/Base.png" alt="" className="w-full h-full object-cover" />
                </div>
                {/* Left: text */}
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/assets/Base.png" alt="Base" className="w-5 h-5 rounded-full" />
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Built on Base</span>
                  </div>
                  <h2 className="text-white font-bold text-lg mb-1">Stake NFTs &amp; Earn on Base</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Earn SHACK rewards by staking your SHACKO NFTs. All rewards are distributed on Base.
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total Earned</p>
                      <p className="text-xl font-bold text-white">
                        {ShackBalance ? Math.floor(Number(formatEther(ShackBalance))).toLocaleString() : '0'}
                        <span className="text-sm text-[#fbbf24] ml-1">SHACK</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Currently Staked</p>
                      <p className="text-xl font-bold text-white">
                        {stakedNFTs ? stakedNFTs.length : 0}
                        <span className="text-sm text-emerald-400 ml-1">NFTs</span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Right: CTAs */}
                <div className="relative z-10 flex-shrink-0 flex flex-col sm:flex-row gap-2">
                  {stakedNFTs && stakedNFTs.length > 0 && (
                    <button
                      onClick={handleClaimAll}
                      disabled={isClaimingAll}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                    >
                      {isClaimingAll ? 'Claiming...' : 'Claim All'}
                    </button>
                  )}
                  <a
                    href="/rewards"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                  >
                    View Rewards <ChevronRight size={15} />
                  </a>
                </div>
              </div>

              {/* Staked NFT Cards */}
              {stakedNFTs && stakedNFTs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Staked SHACKOs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stakedNFTs.map((tokenId) => (
                      <StakedNFTCard
                        key={Number(tokenId)}
                        tokenId={Number(tokenId)}
                        onUnstake={handleUnstake}
                        onEmergencyUnstake={handleEmergencyUnstake}
                        onClaim={handleClaim}
                        isUnstaking={isUnstaking}
                        isEmergencyUnstaking={isEmergencyUnstaking}
                        isClaiming={isClaiming}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Stake / Approve CTA */}
              {nftBalance && Number(nftBalance) > 0 ? (
                !isApproved ? (
                  <div className="bg-[#0d1525] border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm mb-0.5">Approve Staking Contract</p>
                      <p className="text-gray-500 text-xs">One-time approval required before staking</p>
                    </div>
                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="flex items-center justify-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
                    >
                      {isApproving ? 'Approving...' : <><span>Approve</span><ChevronRight size={14} /></>}
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm mb-0.5">Stake a SHACKO NFT</p>
                      <p className="text-gray-500 text-xs">Choose an NFT and lock duration to start earning</p>
                    </div>
                    <button
                      onClick={() => setShowStakeModal(true)}
                      className="flex items-center justify-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
                    >
                      <span>Stake NFT</span><ChevronRight size={14} />
                    </button>
                  </div>
                )
              ) : (
                <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-12 text-center">
                  <Wallet size={28} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No SHACKO NFTs found in your wallet</p>
                </div>
              )}

            </motion.div>
          )}
        </div>
      </main>

      {/* ── STAKE MODAL ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showStakeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0d1525] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-white">Stake Your SHACKO</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Token ID */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Token ID</label>
                <input
                  type="number"
                  value={selectedNFT ?? ''}
                  onChange={(e) => setSelectedNFT(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                  placeholder="Enter your NFT Token ID"
                  min="0"
                  className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#fbbf24]/50 transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Lock Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {durations.map((d, i) => {
                    const Icon = d.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDuration(i)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                          selectedDuration === i
                            ? 'bg-[#fbbf24]/10 border-[#fbbf24]/40 text-white'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/15'
                        }`}
                      >
                        <Icon size={14} className={selectedDuration === i ? 'text-[#fbbf24]' : 'text-gray-600'} />
                        <div>
                          <p className="text-sm font-semibold leading-tight">{d.label}</p>
                          <p className={`text-xs ${selectedDuration === i ? 'text-[#fbbf24]' : 'text-gray-600'}`}>{d.multiplier} bonus</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fee */}
              <div className="bg-white/5 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Stake Fee</span>
                <span className="text-sm font-semibold text-white">0.0001 ETH</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStake}
                  disabled={selectedNFT === null || selectedNFT === undefined || isStaking}
                  className="flex-1 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  {isStaking ? 'Staking...' : 'Stake Now'}
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

// ── STAKED NFT CARD ───────────────────────────────────────────────────────────
function StakedNFTCard({
  tokenId, onUnstake, onEmergencyUnstake, onClaim,
  isUnstaking, isEmergencyUnstaking, isClaiming,
}: {
  tokenId: number;
  onUnstake: (id: number) => void;
  onEmergencyUnstake: (id: number) => void;
  onClaim: (id: number) => void;
  isUnstaking: boolean;
  isEmergencyUnstaking: boolean;
  isClaiming: boolean;
}) {
  const { data: stakeInfo } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getStakeInfo',
    args: [BigInt(tokenId)],
  });

  if (!stakeInfo) return (
    <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-white/5 rounded mb-3 w-1/2" />
      <div className="h-3 bg-white/5 rounded mb-2 w-full" />
      <div className="h-3 bg-white/5 rounded w-3/4" />
    </div>
  );

  const [, stakedAt, unlockTime, pendingRewards, , rarity] = stakeInfo;

  const now = Date.now() / 1000;
  const isUnlocked = Number(unlockTime) <= now;
  const secondsLeft = Math.max(0, Number(unlockTime) - now);
  const daysLeft = Math.floor(secondsLeft / 86400);
  const hoursLeft = Math.floor((secondsLeft % 86400) / 3600);
  const progress = isUnlocked
    ? 100
    : Math.min(100, ((now - Number(stakedAt)) / (Number(unlockTime) - Number(stakedAt))) * 100);

  // Derive duration from the total lock period (unlockTime - stakedAt)
  const totalLockDays = Math.round((Number(unlockTime) - Number(stakedAt)) / 86400);
  const durInfo = totalLockDays <= 7
    ? durationMap[0]
    : totalLockDays <= 14
    ? durationMap[1]
    : totalLockDays <= 30
    ? durationMap[2]
    : durationMap[3];
  const baseRate = baseRateMap[rarity] ?? 10;
  const rarityMult = rarityMultMap[rarity] ?? 100;
  const earningsPerDay = (baseRate * rarityMult * durInfo.mult) / (100 * 100);
  const rCol = rarityColors[rarity] ?? rarityColors['Common'];
  const pendingFormatted = Math.floor(Number(formatEther(pendingRewards)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d1525] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white font-bold text-sm">SHACKO #{tokenId}</p>
          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${rCol.bg} ${rCol.text} ${rCol.border}`}>
            {rarity}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600 mb-0.5">Pending Rewards</p>
          <p className="text-lg font-bold text-emerald-400">{pendingFormatted.toLocaleString()} <span className="text-xs font-normal text-gray-500">xSHACK</span></p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <p className="text-xs text-gray-600 mb-1">Duration</p>
          <p className="text-sm font-semibold text-white">{durInfo.label}</p>
          <p className="text-xs text-[#fbbf24]">{durInfo.multiplier}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <p className="text-xs text-gray-600 mb-1">Per Day</p>
          <p className="text-sm font-semibold text-white">{earningsPerDay.toLocaleString()}</p>
          <p className="text-xs text-gray-600">SHACK</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <p className="text-xs text-gray-600 mb-1">Time Left</p>
          {isUnlocked ? (
            <p className="text-sm font-semibold text-emerald-400">Ready</p>
          ) : (
            <p className="text-sm font-semibold text-white">{daysLeft}d {hoursLeft}h</p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="w-full bg-white/5 rounded-full h-1.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-emerald-400' : 'bg-[#fbbf24]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{isUnlocked ? '✓ Unlocked' : 'In progress'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onClaim(tokenId)}
          disabled={pendingFormatted === 0 || isClaiming}
          className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold py-2 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isClaiming ? 'Claiming...' : 'Claim'}
        </button>
        <button
          onClick={() => onUnstake(tokenId)}
          disabled={!isUnlocked || isUnstaking}
          className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-semibold py-2 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isUnstaking ? 'Unstaking...' : 'Unstake'}
        </button>
      </div>

      {/* Emergency Unstake */}
      {!isUnlocked && (
        <button
          onClick={() => {
            if (confirm('⚠️ Emergency unstake will forfeit ALL your pending rewards and cost 0.0002 ETH. Are you sure?')) {
              onEmergencyUnstake(tokenId);
            }
          }}
          disabled={isEmergencyUnstaking}
          className="w-full mt-2 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium py-2 rounded-xl transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <AlertTriangle size={11} />
          {isEmergencyUnstaking ? 'Processing...' : 'Emergency Unstake'}
        </button>
      )}
    </motion.div>
  );
}
