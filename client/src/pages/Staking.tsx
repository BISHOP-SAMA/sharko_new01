"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState, useEffect, useCallback } from "react";
import { Wallet, Lock, Unlock, Trophy, TrendingUp, Clock, Zap, X, Layers, CheckCircle } from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// MAINNET CONTRACTS
// ══════════════════════════════════════════════════════════════════════════════
const SHACKO_NFT      = '0x7f30f4b6d5C98D29E32cf013558A01443c87C013' as `0x${string}`;
const STAKING_CONTRACT = '0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5' as `0x${string}`;
const SHACK_TOKEN     = '0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3' as `0x${string}`;

// ══════════════════════════════════════════════════════════════════════════════
// IPFS GATEWAY - LIGHTHOUSE
// ══════════════════════════════════════════════════════════════════════════════
const IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/bafybeicizp4e7sh2lou53lyw2gtqsjf6rxcaf3epnkyejwnwjjd6w7mqou";

// ══════════════════════════════════════════════════════════════════════════════
// ABIs
// ══════════════════════════════════════════════════════════════════════════════
const NFT_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function setApprovalForAll(address operator, bool approved)',
]);

const STAKING_ABI = parseAbi([
  'function stake(uint256 tokenId, uint8 duration) payable',
  'function stakeAll(uint256[] tokenIds, uint8 duration) payable',
  'function unstake(uint256 tokenId)',
  'function emergencyUnstake(uint256 tokenId) payable',
  'function claimRewards(uint256 tokenId)',
  'function claimAllRewards()',
  'function calculateRewards(uint256 tokenId) view returns (uint256)',
  'function getUserStakes(address user) view returns (uint256[])',
  'function tokenRarity(uint256 tokenId) view returns (string)',
  'function stakeFee() view returns (uint256)',
  'function stakes(uint256 tokenId) view returns (address owner, uint256 stakedAt, uint8 duration, uint256 unlockTime, uint256 lastClaimTime, bool isStaked)',
]);

const SHACK_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
]);

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════
const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  'Common':    { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40' },
  'Uncommon':  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  'Rare':      { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/40' },
  'Epic':      { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40' },
  'Legendary': { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40' },
  'OneOfOne':  { bg: 'bg-rose-500/20',    text: 'text-rose-300',    border: 'border-rose-500/40' },
};

const DURATIONS = [
  { label: '7 Days',  value: 0, multiplier: '1.0x',  icon: Zap },
  { label: '14 Days', value: 1, multiplier: '1.25x', icon: TrendingUp },
  { label: '30 Days', value: 2, multiplier: '1.5x',  icon: Trophy },
  { label: '60 Days', value: 3, multiplier: '2.0x',  icon: Clock },
];

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════
function formatCountdown(secondsLeft: number): string {
  if (secondsLeft <= 0) return 'Unlocked';
  const d = Math.floor(secondsLeft / 86400);
  const h = Math.floor((secondsLeft % 86400) / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ══════════════════════════════════════════════════════════════════════════════
// DURATION MODAL
// ══════════════════════════════════════════════════════════════════════════════
function DurationModal({
  title,
  onConfirm,
  onClose,
  fee,
  count = 1,
}: {
  title: string;
  onConfirm: (duration: number) => void;
  onClose: () => void;
  fee: bigint | undefined;
  count?: number;
}) {
  const [selected, setSelected] = useState(0);
  const totalFee = fee ? fee * BigInt(count) : parseEther('0.0001') * BigInt(count);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0d1525] border-2 border-[#fbbf24]/30 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">
            Select Lock Duration
          </label>
          <div className="grid grid-cols-2 gap-3">
            {DURATIONS.map((d, i) => {
              const Icon = d.icon;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selected === i
                      ? 'bg-[#fbbf24]/10 border-[#fbbf24] shadow-lg shadow-[#fbbf24]/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon size={18} className={selected === i ? 'text-[#fbbf24]' : 'text-gray-600'} />
                  <div>
                    <p className={`text-base font-bold ${selected === i ? 'text-white' : 'text-gray-400'}`}>
                      {d.label}
                    </p>
                    <p className={`text-sm ${selected === i ? 'text-[#fbbf24]' : 'text-gray-600'}`}>
                      {d.multiplier} rewards
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-gray-400 font-semibold">
            Total Fee {count > 1 ? `(${count} NFTs)` : ''}
          </span>
          <span className="text-base font-black text-white">{formatEther(totalFee)} ETH</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:opacity-90 text-black font-black py-3 rounded-xl transition-opacity"
          >
            Stake Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function Staking() {
  const { address, isConnected } = useAccount();

  // Modal state
  const [stakeModalToken, setStakeModalToken] = useState<number | null>(null);
  const [showStakeAllModal, setShowStakeAllModal] = useState(false);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // CONTRACT READS
  // ════════════════════════════════════════════════════════════════════════════
  const { data: nftBalance } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'isApprovedForAll',
    args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'getUserStakes',
    args: address ? [address] : undefined,
  });

  const { data: shackBalance, refetch: refetchBalance } = useReadContract({
    address: SHACK_TOKEN,
    abi: SHACK_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: stakeFee } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'stakeFee',
  });

  // Fetch owned token IDs
  const tokenCount = nftBalance ? Number(nftBalance) : 0;
  const tokenIndexCalls = Array.from({ length: tokenCount }, (_, i) => ({
    address: SHACKO_NFT,
    abi: NFT_ABI,
    functionName: 'tokenOfOwnerByIndex' as const,
    args: [address!, BigInt(i)],
  }));

  const { data: tokenResults } = useReadContracts({
    contracts: tokenIndexCalls,
    query: { enabled: !!address && tokenCount > 0 },
  });

  const ownedTokenIds: number[] = tokenResults
    ?.filter((r) => r.status === 'success')
    .map((r) => Number(r.result)) ?? [];

  const stakedSet = new Set((stakedNFTs ?? []).map(Number));
  const unstakedTokenIds = ownedTokenIds.filter((id) => !stakedSet.has(id));
  const stakedTokenIds = ownedTokenIds.filter((id) => stakedSet.has(id));

  // ════════════════════════════════════════════════════════════════════════════
  // WRITE CONTRACTS
  // ════════════════════════════════════════════════════════════════════════════
  const { writeContract: approveContract, data: approveHash } = useWriteContract();
  const { writeContract: stakeNFT, data: stakeHash } = useWriteContract();
  const { writeContract: stakeAllNFT, data: stakeAllHash } = useWriteContract();
  const { writeContract: unstakeNFT, data: unstakeHash } = useWriteContract();
  const { writeContract: claimNFT, data: claimHash } = useWriteContract();
  const { writeContract: claimAllNFT, data: claimAllHash } = useWriteContract();

  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isStakingAll } = useWaitForTransactionReceipt({ hash: stakeAllHash });
  const { isLoading: isUnstaking } = useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({ hash: claimHash });
  const { isLoading: isClaimingAll } = useWaitForTransactionReceipt({ hash: claimAllHash });

  const refetchAll = useCallback(() => {
    setTimeout(() => {
      refetchStaked();
      refetchBalance();
      refetchApproval();
    }, 2000);
  }, [refetchStaked, refetchBalance, refetchApproval]);

  // ════════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ════════════════════════════════════════════════════════════════════════════
  const handleApprove = () => {
    approveContract({
      address: SHACKO_NFT,
      abi: NFT_ABI,
      functionName: 'setApprovalForAll',
      args: [STAKING_CONTRACT, true],
    });
  };

  const handleStake = (tokenId: number, duration: number) => {
    stakeNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [BigInt(tokenId), duration],
      value: stakeFee || parseEther('0.0001'),
    });
    setStakeModalToken(null);
    refetchAll();
  };

  const handleStakeAll = (duration: number) => {
    if (unstakedTokenIds.length === 0) return;
    const totalFee = (stakeFee || parseEther('0.0001')) * BigInt(unstakedTokenIds.length);
    stakeAllNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'stakeAll',
      args: [unstakedTokenIds.map(BigInt), duration],
      value: totalFee,
    });
    setShowStakeAllModal(false);
    refetchAll();
  };

  const handleUnstake = (tokenId: number) => {
    unstakeNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [BigInt(tokenId)],
    });
    refetchAll();
  };

  const handleClaim = (tokenId: number) => {
    claimNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'claimRewards',
      args: [BigInt(tokenId)],
    });
    refetchAll();
  };

  const handleClaimAll = () => {
    claimAllNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'claimAllRewards',
    });
    refetchAll();
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Header />

      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1
              className="text-7xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] leading-none mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              STAKE SHACKO
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-bold">
              Earn $SHACK rewards by staking your NFTs
            </p>
          </motion.div>

          {/* NOT CONNECTED */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-[#00d9ff]/30 rounded-3xl p-12 text-center max-w-2xl mx-auto"
            >
              <Wallet size={64} className="mx-auto mb-6 text-[#00d9ff]" />
              <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Connect Your Wallet
              </h2>
              <p className="text-lg text-gray-400">
                Connect your wallet to start staking your SHACKO NFTs
              </p>
            </motion.div>
          )}

          {/* CONNECTED */}
          {isConnected && (
            <>
              {/* STATS BAR */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
              >
                <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border-2 border-[#fbbf24]/30 rounded-2xl p-6">
                  <p className="text-sm text-gray-400 font-bold mb-2">Your $SHACK</p>
                  <p className="text-3xl font-black text-white">
                    {shackBalance ? Math.floor(Number(formatEther(shackBalance))).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-2xl p-6">
                  <p className="text-sm text-gray-400 font-bold mb-2">Staked NFTs</p>
                  <p className="text-3xl font-black text-white">{stakedTokenIds.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-6">
                  <p className="text-sm text-gray-400 font-bold mb-2">Unstaked NFTs</p>
                  <p className="text-3xl font-black text-white">{unstakedTokenIds.length}</p>
                </div>
              </motion.div>

              {/* ACTION BUTTONS */}
              {!isApproved ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 border-2 border-[#fbbf24]/40 rounded-2xl p-8 mb-8 text-center"
                >
                  <Lock size={48} className="mx-auto mb-4 text-[#fbbf24]" />
                  <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Approve NFT Access
                  </h3>
                  <p className="text-gray-400 mb-6">
                    First, approve the staking contract to access your NFTs
                  </p>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:opacity-90 text-black font-black py-4 px-8 rounded-xl transition-opacity disabled:opacity-50 text-lg"
                  >
                    {isApproving ? 'Approving...' : 'Approve Contract'}
                  </button>
                </motion.div>
              ) : (
                <div className="flex gap-4 mb-8">
                  {unstakedTokenIds.length > 0 && (
                    <button
                      onClick={() => setShowStakeAllModal(true)}
                      disabled={isStakingAll}
                      className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:opacity-90 text-black font-black py-4 px-6 rounded-xl transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Layers size={20} />
                      {isStakingAll ? 'Staking All...' : `Stake All (${unstakedTokenIds.length})`}
                    </button>
                  )}
                  {stakedTokenIds.length > 0 && (
                    <button
                      onClick={handleClaimAll}
                      disabled={isClaimingAll}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white font-black py-4 px-6 rounded-xl transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      {isClaimingAll ? 'Claiming All...' : `Claim All Rewards`}
                    </button>
                  )}
                </div>
              )}

              {/* UNSTAKED NFTS */}
              {unstakedTokenIds.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-4xl font-black text-white mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Your Unstaked NFTs ({unstakedTokenIds.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {unstakedTokenIds.map((tokenId) => (
                      <UnstakedNFTCard
                        key={tokenId}
                        tokenId={tokenId}
                        onStake={() => setStakeModalToken(tokenId)}
                        isStaking={isStaking}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STAKED NFTS */}
              {stakedTokenIds.length > 0 && (
                <div>
                  <h2 className="text-4xl font-black text-white mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Your Staked NFTs ({stakedTokenIds.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {stakedTokenIds.map((tokenId) => (
                      <StakedNFTCard
                        key={tokenId}
                        tokenId={tokenId}
                        now={now}
                        onUnstake={handleUnstake}
                        onClaim={handleClaim}
                        isUnstaking={isUnstaking}
                        isClaiming={isClaiming}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* EMPTY STATE */}
              {ownedTokenIds.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-white/10 rounded-3xl p-12 text-center"
                >
                  <Trophy size={64} className="mx-auto mb-6 text-gray-600" />
                  <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    No SHACKO NFTs Found
                  </h3>
                  <p className="text-gray-400">
                    You don't own any SHACKO NFTs yet
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* MODALS */}
      <AnimatePresence>
        {stakeModalToken !== null && (
          <DurationModal
            title={`Stake SHACKO #${stakeModalToken}`}
            onConfirm={(duration) => handleStake(stakeModalToken, duration)}
            onClose={() => setStakeModalToken(null)}
            fee={stakeFee}
          />
        )}
        {showStakeAllModal && (
          <DurationModal
            title="Stake All NFTs"
            onConfirm={handleStakeAll}
            onClose={() => setShowStakeAllModal(false)}
            fee={stakeFee}
            count={unstakedTokenIds.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// UNSTAKED NFT CARD
// ══════════════════════════════════════════════════════════════════════════════
function UnstakedNFTCard({
  tokenId,
  onStake,
  isStaking,
}: {
  tokenId: number;
  onStake: () => void;
  isStaking: boolean;
}) {
  const { data: rarity } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'tokenRarity',
    args: [BigInt(tokenId)],
  });

  const rarityStr = rarity || 'Common';
  const colors = rarityColors[rarityStr] || rarityColors.Common;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0d1525] border-2 border-white/10 rounded-2xl overflow-hidden hover:border-[#fbbf24]/50 transition-all group"
    >
      {/* NFT Image */}
      <div className="w-full aspect-square bg-gradient-to-br from-[#1a3a52] to-[#0d1525] overflow-hidden relative">
        <img
          src={`${IPFS_GATEWAY}/${tokenId}.png`}
          alt={`SHACKO #${tokenId}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x400/0d1525/fbbf24?text=SHACKO";
          }}
        />
        {/* Rarity Badge */}
        <div className={`absolute top-3 right-3 ${colors.bg} ${colors.border} border-2 backdrop-blur-sm px-3 py-1 rounded-full`}>
          <span className={`${colors.text} text-xs font-black uppercase`}>{rarityStr}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          SHACKO #{tokenId}
        </h3>

        <button
          onClick={onStake}
          disabled={isStaking}
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:opacity-90 text-black font-black py-3 rounded-xl transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Lock size={16} />
          {isStaking ? 'Staking...' : 'Stake NFT'}
        </button>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STAKED NFT CARD
// ══════════════════════════════════════════════════════════════════════════════
function StakedNFTCard({
  tokenId,
  now,
  onUnstake,
  onClaim,
  isUnstaking,
  isClaiming,
}: {
  tokenId: number;
  now: number;
  onUnstake: (tokenId: number) => void;
  onClaim: (tokenId: number) => void;
  isUnstaking: boolean;
  isClaiming: boolean;
}) {
  const { data: stakeData } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'stakes',
    args: [BigInt(tokenId)],
  });

  const { data: rarity } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'tokenRarity',
    args: [BigInt(tokenId)],
  });

  const { data: pendingRewards } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'calculateRewards',
    args: [BigInt(tokenId)],
  });

  if (!stakeData) return null;

  const [, , , unlockTime] = stakeData;
  const unlockTimestamp = Number(unlockTime);
  const secondsLeft = unlockTimestamp - now;
  const isUnlocked = secondsLeft <= 0;

  const rarityStr = rarity || 'Common';
  const colors = rarityColors[rarityStr] || rarityColors.Common;
  const rewards = pendingRewards ? formatEther(pendingRewards) : '0';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0d1525] border-2 border-blue-500/30 rounded-2xl overflow-hidden"
    >
      {/* NFT Image */}
      <div className="w-full aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 overflow-hidden relative">
        <img
          src={`${IPFS_GATEWAY}/${tokenId}.png`}
          alt={`SHACKO #${tokenId}`}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x400/0d1525/fbbf24?text=SHACKO";
          }}
        />
        {/* Locked Badge */}
        <div className="absolute top-3 right-3 bg-blue-500/80 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-blue-400">
          <span className="text-white text-xs font-black uppercase flex items-center gap-1">
            <Lock size={12} />
            Staked
          </span>
        </div>
        {/* Rarity Badge */}
        <div className={`absolute top-3 left-3 ${colors.bg} ${colors.border} border-2 backdrop-blur-sm px-3 py-1 rounded-full`}>
          <span className={`${colors.text} text-xs font-black uppercase`}>{rarityStr}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          SHACKO #{tokenId}
        </h3>

        {/* Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400 font-semibold">Unlock In</span>
            <span className={`text-sm font-black ${isUnlocked ? 'text-green-400' : 'text-white'}`}>
              {formatCountdown(secondsLeft)}
            </span>
          </div>
          <div className="flex items-center justify-between bg-[#fbbf24]/10 rounded-lg px-3 py-2 border border-[#fbbf24]/20">
            <span className="text-xs text-gray-400 font-semibold">Pending $SHACK</span>
            <span className="text-sm font-black text-[#fbbf24]">
              {parseFloat(rewards).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onClaim(tokenId)}
            disabled={isClaiming || parseFloat(rewards) === 0}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white font-bold py-2 px-3 rounded-lg transition-opacity disabled:opacity-30 text-sm"
          >
            {isClaiming ? 'Claiming...' : 'Claim'}
          </button>
          <button
            onClick={() => onUnstake(tokenId)}
            disabled={!isUnlocked || isUnstaking}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white font-bold py-2 px-3 rounded-lg transition-opacity disabled:opacity-30 text-sm"
          >
            {isUnstaking ? 'Unstaking...' : 'Unstake'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
