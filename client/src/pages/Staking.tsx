"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState, useEffect, useCallback } from "react";
import { Wallet, Lock, Trophy, TrendingUp, Clock, Zap, X, AlertTriangle, ChevronRight, Layers } from "lucide-react";

// ── CONTRACTS ─────────────────────────────────────────────────────────────────
const SHACKO_NFT       = '0x7f30f4b6d5C98D29E32cf013558A01443c87C013';
const STAKING_CONTRACT = '0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5';
const SHACK_TOKEN      = '0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3';

// ── IPFS ──────────────────────────────────────────────────────────────────────
const IPFS_IMAGE_BASE = 'https://gateway.lighthouse.storage/ipfs/bafybeicizp4e7sh2lou53lyw2gtqsjf6rxcaf3epnkyejwnwjjd6w7mqou';

// ── ABIs ──────────────────────────────────────────────────────────────────────
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
  'function getUserStakes(address user) view returns (uint256[])',
  'function getStakeInfo(uint256 tokenId) view returns (address owner, uint256 stakedAt, uint256 unlockTime, uint256 pendingRewards, bool isStaked, string rarity)',
  'function calculateRewards(uint256 tokenId) view returns (uint256)',
  'function stakeFee() view returns (uint256)',
  'function tokenRarity(uint256 tokenId) view returns (string)',
]);

const SHACK_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
]);

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const IPFS_BASE = 'https://gateway.lighthouse.storage/ipfs/bafybeifbjqcpmzdp7cu7elgegetznctxiwdibjdsjmlz7ck2lkfy3gzaey';

const rarityColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  'Common':    { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40',   glow: '' },
  'Uncommon':  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' },
  'Rare':      { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/40',    glow: 'shadow-blue-500/20' },
  'Epic':      { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40',  glow: 'shadow-purple-500/20' },
  'Legendary': { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40',   glow: 'shadow-amber-500/30' },
  'OneOfOne':  { bg: 'bg-rose-500/20',    text: 'text-rose-300',    border: 'border-rose-500/40',    glow: 'shadow-rose-500/30' },
};

const baseRateMap: Record<string, number> = {
  'Common': 10, 'Uncommon': 15, 'Rare': 20,
  'Epic': 40,   'Legendary': 70, 'OneOfOne': 100,
};

const rarityMultMap: Record<string, number> = {
  'Common': 100, 'Uncommon': 125, 'Rare': 150,
  'Epic': 200,   'Legendary': 300, 'OneOfOne': 500,
};

const DURATIONS = [
  { label: '7 Days',  multiplier: '1.0x',  icon: Zap,        mult: 100 },
  { label: '14 Days', multiplier: '1.25x', icon: TrendingUp, mult: 125 },
  { label: '30 Days', multiplier: '1.5x',  icon: Trophy,     mult: 150 },
  { label: '60 Days', multiplier: '2.0x',  icon: Clock,      mult: 200 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function formatCountdown(secondsLeft: number): string {
  if (secondsLeft <= 0) return 'Unlocked';
  const d = Math.floor(secondsLeft / 86400);
  const h = Math.floor((secondsLeft % 86400) / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = Math.floor(secondsLeft % 60);
  if (d > 0) return `${d}D ${h}H ${m}M`;
  if (h > 0) return `${h}H ${m}M ${s}S`;
  return `${m}M ${s}S`;
}

function nftImage(tokenId: number): string {
  return `${IPFS_IMAGE_BASE}/${tokenId}.png`;
}

// ── DURATION MODAL ────────────────────────────────────────────────────────────
function DurationModal({
  title, subtitle, onConfirm, onClose, fee, count = 1,
}: {
  title: string; subtitle?: string;
  onConfirm: (duration: number) => void;
  onClose: () => void;
  fee: bigint | undefined;
  count?: number;
}) {
  const [selected, setSelected] = useState(0);
  const totalFee = (fee ?? parseEther('0.0001')) * BigInt(count);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0d1525] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        {subtitle && <p className="text-xs text-gray-500 mb-5">{subtitle}</p>}
        {!subtitle && <div className="mb-5" />}

        <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Lock Duration</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {DURATIONS.map((d, i) => {
            const Icon = d.icon;
            return (
              <button
                key={i} onClick={() => setSelected(i)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  selected === i
                    ? 'bg-[#fbbf24]/10 border-[#fbbf24]/40 text-white'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/15'
                }`}
              >
                <Icon size={14} className={selected === i ? 'text-[#fbbf24]' : 'text-gray-600'} />
                <div>
                  <p className="text-sm font-semibold leading-tight">{d.label}</p>
                  <p className={`text-xs ${selected === i ? 'text-[#fbbf24]' : 'text-gray-600'}`}>{d.multiplier} bonus</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white/5 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
          <span className="text-xs text-gray-500">Total Fee {count > 1 ? `(${count} NFTs × 0.0001)` : ''}</span>
          <span className="text-sm font-semibold text-white">{formatEther(totalFee)} ETH</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2.5 rounded-xl transition-colors text-sm">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="flex-1 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Confirm & Stake
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Staking() {
  const { address, isConnected } = useAccount();
  const [stakeModalToken, setStakeModalToken] = useState<number | null>(null);
  const [showStakeAllModal, setShowStakeAllModal] = useState(false);

  // ── Reads ──
  const { data: nftBalance } = useReadContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'isApprovedForAll',
    args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes',
    args: address ? [address] : undefined,
  });

  const { data: shackBalance, refetch: refetchBalance } = useReadContract({
    address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: stakeFee } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeFee',
  });

  // Fetch all token IDs owned by user
  const tokenCount = nftBalance ? Number(nftBalance) : 0;
  const { data: tokenResults } = useReadContracts({
    contracts: Array.from({ length: tokenCount }, (_, i) => ({
      address: SHACKO_NFT as `0x${string}`,
      abi: NFT_ABI,
      functionName: 'tokenOfOwnerByIndex' as const,
      args: [address!, BigInt(i)],
    })),
    query: { enabled: !!address && tokenCount > 0 },
  });

  const ownedTokenIds: number[] = tokenResults
    ?.filter((r) => r.status === 'success')
    .map((r) => Number(r.result)) ?? [];

  const stakedSet = new Set((stakedNFTs ?? []).map(Number));
  const unstakedTokenIds = ownedTokenIds.filter((id) => !stakedSet.has(id));

  // ── Writes ──
  const { writeContract: approveContract, data: approveHash }         = useWriteContract();
  const { writeContract: stakeNFT,        data: stakeHash }           = useWriteContract();
  const { writeContract: stakeAllNFT,     data: stakeAllHash }        = useWriteContract();
  const { writeContract: unstakeNFT,      data: unstakeHash }         = useWriteContract();
  const { writeContract: emergencyNFT,    data: emergencyHash }       = useWriteContract();
  const { writeContract: claimNFT,        data: claimHash }           = useWriteContract();
  const { writeContract: claimAllNFT,     data: claimAllHash }        = useWriteContract();

  const { isLoading: isApproving }   = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking }     = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isStakingAll }  = useWaitForTransactionReceipt({ hash: stakeAllHash });
  const { isLoading: isUnstaking }   = useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isLoading: isEmergency }   = useWaitForTransactionReceipt({ hash: emergencyHash });
  const { isLoading: isClaiming }    = useWaitForTransactionReceipt({ hash: claimHash });
  const { isLoading: isClaimingAll } = useWaitForTransactionReceipt({ hash: claimAllHash });

  const refetchAll = useCallback(() => {
    setTimeout(() => { refetchStaked(); refetchBalance(); refetchApproval(); }, 2500);
  }, [refetchStaked, refetchBalance, refetchApproval]);

  const handleApprove = () => approveContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'setApprovalForAll',
    args: [STAKING_CONTRACT, true],
  });

  const handleStake = (tokenId: number, duration: number) => {
    stakeNFT({
      address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stake',
      args: [BigInt(tokenId), duration],
      value: stakeFee ?? parseEther('0.0001'),
    });
    setStakeModalToken(null);
    refetchAll();
  };

  const handleStakeAll = (duration: number) => {
    if (!unstakedTokenIds.length) return;
    stakeAllNFT({
      address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeAll',
      args: [unstakedTokenIds.map(BigInt), duration],
      value: (stakeFee ?? parseEther('0.0001')) * BigInt(unstakedTokenIds.length),
    });
    setShowStakeAllModal(false);
    refetchAll();
  };

  const handleUnstake = (tokenId: number) => {
    unstakeNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(tokenId)] });
    refetchAll();
  };

  const handleEmergencyUnstake = (tokenId: number) => {
    emergencyNFT({
      address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'emergencyUnstake',
      args: [BigInt(tokenId)], value: parseEther('0.0002'),
    });
    refetchAll();
  };

  const handleClaim = (tokenId: number) => {
    claimNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimRewards', args: [BigInt(tokenId)] });
    refetchAll();
  };

  const handleClaimAll = () => {
    claimAllNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimAllRewards', args: [] });
    refetchAll();
  };

  const shackFormatted = shackBalance ? Math.floor(Number(formatEther(shackBalance))).toLocaleString() : '0';
  const stakedCount = stakedNFTs?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#060b18] overflow-x-hidden">
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {!isConnected ? (
            // ── NOT CONNECTED ─────────────────────────────────────────────────
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center mb-6">
                <Wallet size={28} className="text-[#fbbf24]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Stake Your SHACKOs</h1>
              <p className="text-gray-400 mb-8 max-w-sm text-sm">Connect your wallet to view your NFTs and start earning $SHACK on Base</p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button onClick={openConnectModal} className="flex items-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                    Connect Wallet <ChevronRight size={16} />
                  </button>
                )}
              </ConnectButton.Custom>
            </motion.div>

          ) : (
            // ── DASHBOARD ─────────────────────────────────────────────────────
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* ── HERO BANNER ─────────────────────────────────────────────── */}
              <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-[#0d1525] via-[#0a1628] to-[#060b18] border border-blue-500/20 p-6 md:p-8">
                <div className="absolute right-0 top-0 w-64 h-64 opacity-[0.07] pointer-events-none">
                  <img src="/assets/Base.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <img src="/assets/Base.png" alt="Base" className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Live on Base Mainnet</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Stake NFTs &amp; Earn $SHACK</h1>
                    <p className="text-gray-400 text-sm max-w-md">Lock your SHACKO NFTs to earn $SHACK rewards. Longer locks earn bigger multipliers.</p>
                  </div>
                  {/* Global stats */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">$SHACK Earned</p>
                      <p className="text-2xl font-bold text-[#fbbf24]">{shackFormatted}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">NFTs Staked</p>
                      <p className="text-2xl font-bold text-emerald-400">{stakedCount}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">In Wallet</p>
                      <p className="text-2xl font-bold text-blue-400">{unstakedTokenIds.length}</p>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="relative z-10 flex flex-wrap gap-3 mt-6">
                  {stakedCount > 0 && (
                    <button
                      onClick={handleClaimAll}
                      disabled={isClaimingAll}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      {isClaimingAll ? 'Claiming...' : `Claim All Rewards`}
                    </button>
                  )}
                  {unstakedTokenIds.length > 1 && isApproved && (
                    <button
                      onClick={() => setShowStakeAllModal(true)}
                      disabled={isStakingAll}
                      className="flex items-center gap-2 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24] font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                    >
                      <Layers size={14} />
                      {isStakingAll ? 'Staking...' : `Stake All (${unstakedTokenIds.length})`}
                    </button>
                  )}
                  <a href="/rewards" className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                    View Rewards <ChevronRight size={14} />
                  </a>
                </div>
              </div>

              {/* ── APPROVE BANNER ──────────────────────────────────────────── */}
              {!isApproved && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">Approve Staking Contract</p>
                    <p className="text-gray-500 text-xs">One-time approval required before you can stake any NFTs</p>
                  </div>
                  <button
                    onClick={handleApprove} disabled={isApproving}
                    className="flex items-center justify-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
                  >
                    {isApproving ? 'Approving...' : 'Approve Contract'}
                    {!isApproving && <ChevronRight size={14} />}
                  </button>
                </div>
              )}

              {/* ── STAKED NFTs ──────────────────────────────────────────────── */}
              {stakedNFTs && stakedNFTs.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Staked SHACKOs ({stakedNFTs.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {stakedNFTs.map((tokenId) => (
                      <StakedNFTCard
                        key={Number(tokenId)} tokenId={Number(tokenId)}
                        onUnstake={handleUnstake} onEmergencyUnstake={handleEmergencyUnstake} onClaim={handleClaim}
                        isUnstaking={isUnstaking} isEmergencyUnstaking={isEmergency} isClaiming={isClaiming}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── UNSTAKED NFTs ─────────────────────────────────────────────── */}
              {isApproved && unstakedTokenIds.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Your SHACKOs ({unstakedTokenIds.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unstakedTokenIds.map((tokenId) => (
                      <UnstakedNFTCard
                        key={tokenId} tokenId={tokenId}
                        onStake={(id) => setStakeModalToken(id)}
                        isStaking={isStaking && stakeModalToken === tokenId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No NFTs */}
              {tokenCount === 0 && (
                <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-16 text-center">
                  <Wallet size={32} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No SHACKO NFTs in your wallet</p>
                  <p className="text-gray-600 text-sm mt-1">Get SHACKO NFTs to start staking and earning $SHACK</p>
                </div>
              )}

            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {stakeModalToken !== null && (
          <DurationModal
            title={`Stake SHACKO #${stakeModalToken}`}
            subtitle="Choose a lock duration — longer locks earn bigger rewards"
            fee={stakeFee} count={1}
            onConfirm={(d) => handleStake(stakeModalToken, d)}
            onClose={() => setStakeModalToken(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showStakeAllModal && (
          <DurationModal
            title={`Stake All ${unstakedTokenIds.length} SHACKOs`}
            subtitle="All NFTs will be staked with the same lock duration"
            fee={stakeFee} count={unstakedTokenIds.length}
            onConfirm={handleStakeAll}
            onClose={() => setShowStakeAllModal(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ── UNSTAKED NFT CARD ─────────────────────────────────────────────────────────
function UnstakedNFTCard({ tokenId, onStake, isStaking }: {
  tokenId: number;
  onStake: (id: number) => void;
  isStaking: boolean;
}) {
  const { data: rarityData } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI,
    functionName: 'tokenRarity', args: [BigInt(tokenId)],
  });

  const [imgError, setImgError] = useState(false);
  const rarity = (rarityData as string) || '';
  const rCol = rarityColors[rarity] ?? rarityColors['Common'];
  const dailyRate = baseRateMap[rarity] ?? 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all hover:shadow-xl ${rCol.glow}`}
    >
      {/* NFT Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
        {!imgError ? (
          <img
            src={nftImage(tokenId)}
            alt={`SHACKO #${tokenId}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-5xl font-black text-white/10" style={{ fontFamily: 'Impact, sans-serif' }}>#{tokenId}</p>
          </div>
        )}
        {rarity && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold border ${rCol.bg} ${rCol.text} ${rCol.border} backdrop-blur-sm`}>
            {rarity}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-sm">SHACKO #{tokenId}</p>
          {dailyRate > 0 && (
            <p className="text-xs text-[#fbbf24] font-semibold">{dailyRate}/day</p>
          )}
        </div>

        {/* Traits row */}
        {rarity && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
            <span>$SHACK</span>
            <span>·</span>
            <span>{rarity}</span>
          </div>
        )}

        <button
          onClick={() => onStake(tokenId)}
          disabled={isStaking}
          className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {isStaking ? 'Staking...' : 'Stake'}
        </button>
      </div>
    </motion.div>
  );
}

// ── STAKED NFT CARD ───────────────────────────────────────────────────────────
function StakedNFTCard({ tokenId, onUnstake, onEmergencyUnstake, onClaim, isUnstaking, isEmergencyUnstaking, isClaiming }: {
  tokenId: number;
  onUnstake: (id: number) => void;
  onEmergencyUnstake: (id: number) => void;
  onClaim: (id: number) => void;
  isUnstaking: boolean;
  isEmergencyUnstaking: boolean;
  isClaiming: boolean;
}) {
  const { data: stakeInfo, refetch } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getStakeInfo',
    args: [BigInt(tokenId)],
  });

  const [imgError, setImgError] = useState(false);
  const [now, setNow] = useState(Date.now() / 1000);

  // Real-time countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(t);
  }, []);

  // Refresh rewards every 30s
  useEffect(() => {
    const t = setInterval(() => refetch(), 30000);
    return () => clearInterval(t);
  }, [refetch]);

  if (!stakeInfo) return (
    <div className="bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-white/5 rounded w-1/2" />
        <div className="h-3 bg-white/5 rounded w-3/4" />
        <div className="h-8 bg-white/5 rounded mt-3" />
      </div>
    </div>
  );

  const [, stakedAt, unlockTime, pendingRewards, , rarity] = stakeInfo;
  const isUnlocked = Number(unlockTime) <= now;
  const secondsLeft = Math.max(0, Number(unlockTime) - now);
  const progress = isUnlocked ? 100 : Math.min(100, ((now - Number(stakedAt)) / (Number(unlockTime) - Number(stakedAt))) * 100);

  const totalLockDays = Math.round((Number(unlockTime) - Number(stakedAt)) / 86400);
  const durIndex = totalLockDays <= 7 ? 0 : totalLockDays <= 14 ? 1 : totalLockDays <= 30 ? 2 : 3;
  const durInfo = DURATIONS[durIndex];

  const earningsPerDay = Math.round((baseRateMap[rarity] ?? 10) * (rarityMultMap[rarity] ?? 100) * durInfo.mult / (100 * 100));
  const rCol = rarityColors[rarity] ?? rarityColors['Common'];
  const pendingFormatted = Math.floor(Number(formatEther(pendingRewards)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0d1525] border rounded-2xl overflow-hidden transition-all ${isUnlocked ? 'border-emerald-500/30' : 'border-white/5'} hover:shadow-xl`}
    >
      {/* NFT Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
        {!imgError ? (
          <img
            src={nftImage(tokenId)}
            alt={`SHACKO #${tokenId}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-5xl font-black text-white/10" style={{ fontFamily: 'Impact, sans-serif' }}>#{tokenId}</p>
          </div>
        )}

        {/* Rarity badge */}
        {rarity && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold border ${rCol.bg} ${rCol.text} ${rCol.border} backdrop-blur-sm`}>
            {rarity}
          </div>
        )}

        {/* Countdown overlay */}
        <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 backdrop-blur-md ${isUnlocked ? 'bg-emerald-900/60' : 'bg-black/60'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Locking Ends</span>
            <span className={`text-xs font-bold tabular-nums ${isUnlocked ? 'text-emerald-400' : 'text-white'}`}>
              {isUnlocked ? '✓ Ready' : formatCountdown(secondsLeft)}
            </span>
          </div>
          <div className="mt-1.5 w-full bg-white/10 rounded-full h-1">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-400' : 'bg-[#fbbf24]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-white font-bold text-sm">SHACKO #{tokenId}</p>
            <p className="text-xs text-gray-500 mt-0.5">{durInfo.label} · {durInfo.multiplier} bonus</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Earned</p>
            <p className="text-base font-bold text-emerald-400 tabular-nums">{pendingFormatted.toLocaleString()}</p>
            <p className="text-xs text-gray-600">$SHACK</p>
          </div>
        </div>

        {/* APR / Per day row */}
        <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 mb-3">
          <span className="text-xs text-gray-500">Per Day</span>
          <span className="text-xs font-semibold text-[#fbbf24]">{earningsPerDay} $SHACK</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onClaim(tokenId)}
            disabled={pendingFormatted === 0 || isClaiming}
            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold py-2 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isClaiming ? '...' : 'Claim'}
          </button>
          <button
            onClick={() => onUnstake(tokenId)}
            disabled={!isUnlocked || isUnstaking}
            className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-semibold py-2 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUnstaking ? '...' : 'Unstake'}
          </button>
        </div>

        {/* Emergency */}
        {!isUnlocked && (
          <button
            onClick={() => {
              if (confirm('⚠️ Emergency unstake forfeits ALL pending $SHACK rewards and costs 0.0002 ETH. Continue?')) {
                onEmergencyUnstake(tokenId);
              }
            }}
            disabled={isEmergencyUnstaking}
            className="w-full mt-2 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium py-2 rounded-xl transition-colors text-xs disabled:opacity-40"
          >
            <AlertTriangle size={11} />
            {isEmergencyUnstaking ? 'Processing...' : 'Emergency Unstake'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
