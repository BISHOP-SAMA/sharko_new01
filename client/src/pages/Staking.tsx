"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState, useEffect, useCallback, useMemo } from "react";
import { Wallet, Zap, TrendingUp, Trophy, Clock, X, AlertTriangle, ChevronRight, Layers } from "lucide-react";

// ── MAINNET CONTRACTS ───────────────────────────────────────────────────────
const SHACKO_NFT       = '0x7f30f4b6d5C98D29E32cf013558A01443c87C013' as const;
const STAKING_CONTRACT = '0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5' as const;
const SHACK_TOKEN      = '0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3' as const;

// ── IPFS ──────────────────────────────────────────────────────────────────────
const IPFS_METADATA_BASE = 'https://gateway.lighthouse.storage/ipfs/bafybeifbjqcpmzdp7cu7elgegetznctxiwdibjdsjmlz7ck2lkfy3gzaey';

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
  'function getStakeInfo(uint256 tokenId) view returns (address, uint256, uint8, uint256, uint256, bool)',
  'function tokenRarity(uint256 tokenId) view returns (string)',
  'function stakeFee() view returns (uint256)',
]);

const SHACK_ABI = parseAbi(['function balanceOf(address account) view returns (uint256)']);

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
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
  { label: '7 Days',  multiplier: '1.0x',  icon: Zap,        mult: 100, value: 0 },
  { label: '14 Days', multiplier: '1.25x', icon: TrendingUp, mult: 125, value: 1 },
  { label: '30 Days', multiplier: '1.5x',  icon: Trophy,     mult: 150, value: 2 },
  { label: '60 Days', multiplier: '2.0x',  icon: Clock,      mult: 200, value: 3 },
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

// ── DURATION MODAL (unchanged from previous) ─────────────────────────────────
function DurationModal({ title, subtitle, onConfirm, onClose, fee, count = 1 }: {
  title: string; subtitle?: string;
  onConfirm: (duration: number) => void;
  onClose: () => void;
  fee: bigint | undefined;
  count?: number;
}) {
  const [selected, setSelected] = useState(0);
  const totalFee = (fee ?? parseEther('0.0001')) * BigInt(count);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0d1525] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Modal content - same as before */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-500 hover:text-white" /></button>
        </div>
        {subtitle && <p className="text-xs text-gray-500 mb-5">{subtitle}</p>}

        <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Lock Duration</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {DURATIONS.map((d, i) => {
            const Icon = d.icon;
            return (
              <button key={i} onClick={() => setSelected(i)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  selected === i ? 'bg-[#fbbf24]/10 border-[#fbbf24]/40 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/15'
                }`}>
                <Icon size={14} className={selected === i ? 'text-[#fbbf24]' : 'text-gray-600'} />
                <div>
                  <p className="text-sm font-semibold">{d.label}</p>
                  <p className={`text-xs ${selected === i ? 'text-[#fbbf24]' : 'text-gray-600'}`}>{d.multiplier} bonus</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white/5 rounded-xl px-4 py-3 mb-5 flex justify-between">
          <span className="text-xs text-gray-500">Total Fee {count > 1 ? `(${count} NFTs)` : ''}</span>
          <span className="text-sm font-semibold text-white">{formatEther(totalFee)} ETH</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2.5 rounded-xl text-sm">Cancel</button>
          <button onClick={() => onConfirm(DURATIONS[selected].value)}
            className="flex-1 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-2.5 rounded-xl text-sm">
            Confirm & Stake
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Staking() {
  const { address, isConnected } = useAccount();
  const [stakeModalToken, setStakeModalToken] = useState<number | null>(null);
  const [showStakeAllModal, setShowStakeAllModal] = useState(false);

  // Reads
  const { data: nftBalance } = useReadContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'balanceOf', args: address ? [address] : undefined });
  const { data: isApproved, refetch: refetchApproval } = useReadContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'isApprovedForAll', args: address ? [address, STAKING_CONTRACT] : undefined });
  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes', args: address ? [address] : undefined });
  const { data: shackBalance } = useReadContract({ address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf', args: address ? [address] : undefined });
  const { data: stakeFee } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeFee' });

  const tokenCount = nftBalance ? Number(nftBalance) : 0;

  const { data: tokenResults } = useReadContracts({
    contracts: Array.from({ length: tokenCount }, (_, i) => ({
      address: SHACKO_NFT,
      abi: NFT_ABI,
      functionName: 'tokenOfOwnerByIndex',
      args: [address!, BigInt(i)],
    })),
    query: { enabled: !!address && tokenCount > 0 },
  });

  const ownedTokenIds = useMemo(() => 
    tokenResults?.filter(r => r.status === 'success').map(r => Number(r.result)) ?? [], 
  [tokenResults]);

  const stakedSet = useMemo(() => new Set(stakedNFTs?.map(Number) ?? []), [stakedNFTs]);
  const unstakedTokenIds = useMemo(() => ownedTokenIds.filter(id => !stakedSet.has(id)), [ownedTokenIds, stakedSet]);

  // Write hooks and handlers (same as previous corrected version)
  const { writeContract: approveContract } = useWriteContract();
  const { writeContract: stakeNFT } = useWriteContract();
  const { writeContract: stakeAllNFT } = useWriteContract();
  const { writeContract: unstakeNFT } = useWriteContract();
  const { writeContract: emergencyNFT } = useWriteContract();
  const { writeContract: claimNFT } = useWriteContract();
  const { writeContract: claimAllNFT } = useWriteContract();

  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveContract.data as any });
  // ... add other isLoading states similarly (isStaking, isUnstaking, etc.)

  const refetchAll = useCallback(() => {
    setTimeout(() => { refetchStaked(); /* refetch others */ }, 3000);
  }, [refetchStaked]);

  // ... (handleApprove, handleStake, handleStakeAll, handleUnstake, etc. - same as before)

  return (
    <div className="min-h-screen bg-[#060b18]">
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-8">
        {/* Hero, Approve banner, Staked & Unstaked sections - same structure as previous version */}
        {/* Use <UnstakedNFTCard /> and <StakedNFTCard /> below */}
      </main>

      <AnimatePresence>
        {stakeModalToken && <DurationModal title={`Stake SHACKO #${stakeModalToken}`} onConfirm={(d) => { /* handleStake */ }} onClose={() => setStakeModalToken(null)} fee={stakeFee} />}
        {showStakeAllModal && <DurationModal title={`Stake All ${unstakedTokenIds.length} SHACKOs`} onConfirm={/* handleStakeAll */} onClose={() => setShowStakeAllModal(false)} fee={stakeFee} count={unstakedTokenIds.length} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ── UNSTAKED CARD with dynamic image from metadata ───────────────────────────
function UnstakedNFTCard({ tokenId, onStake, isStaking }: { tokenId: number; onStake: (id: number) => void; isStaking: boolean }) {
  const { data: rarityData } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'tokenRarity', args: [BigInt(tokenId)] });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const rarity = (rarityData as string) || 'Common';
  const rCol = rarityColors[rarity] ?? rarityColors.Common;

  // Load real image URL from metadata JSON
  useEffect(() => {
    fetch(`\( {IPFS_METADATA_BASE}/ \){tokenId}.json`)
      .then(res => res.json())
      .then(data => {
        if (data.image) setImageUrl(data.image);
        else setImageUrl(`https://gateway.lighthouse.storage/ipfs/bafybeicizp4e7sh2lou53lyw2gtqsjf6rxcaf3epnkyejwnwjjd6w7mqou/${tokenId}.png`);
      })
      .catch(() => {
        setImageUrl(`https://gateway.lighthouse.storage/ipfs/bafybeicizp4e7sh2lou53lyw2gtqsjf6rxcaf3epnkyejwnwjjd6w7mqou/${tokenId}.png`);
      });
  }, [tokenId]);

  return (
    <motion.div className={`bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 ${rCol.glow}`}>
      <div className="relative aspect-square bg-gradient-to-br from-white/5 overflow-hidden">
        {imageUrl && !imgError ? (
          <img src={imageUrl} alt={`SHACKO #${tokenId}`} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/50">
            <p className="text-5xl font-black text-white/10">#{tokenId}</p>
          </div>
        )}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold border ${rCol.bg} ${rCol.text} ${rCol.border}`}>
          {rarity}
        </div>
      </div>

      <div className="p-4">
        <p className="font-bold text-white">SHACKO #{tokenId}</p>
        <button onClick={() => onStake(tokenId)} disabled={isStaking}
          className="mt-4 w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-2.5 rounded-xl text-sm">
          {isStaking ? 'Staking...' : 'Stake'}
        </button>
      </div>
    </motion.div>
  );
}

// For StakedNFTCard, you can apply the same dynamic image loading logic.