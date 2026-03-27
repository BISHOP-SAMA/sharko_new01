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
const SHACKO_NFT = '0x7f30f4b6d5C98D29E32cf013558A01443c87C013' as const;
const STAKING_CONTRACT = '0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5' as const;
const SHACK_TOKEN = '0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3' as const;

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

// ── DURATION MODAL ────────────────────────────────────────────────────────────
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

        <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Lock Duration</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {DURATIONS.map((d, i) => {
            const Icon = d.icon;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
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
          <span className="text-xs text-gray-500">Total Fee {count > 1 ? `(${count} NFTs)` : ''}</span>
          <span className="text-sm font-semibold text-white">{formatEther(totalFee)} ETH</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2.5 rounded-xl transition-colors text-sm">Cancel</button>
          <button
            onClick={() => onConfirm(DURATIONS[selected].value)}
            className="flex-1 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
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
  const { data: shackBalance, refetch: refetchBalance } = useReadContract({ address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf', args: address ? [address] : undefined });
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

  const ownedTokenIds = useMemo(() => tokenResults?.filter(r => r.status === 'success').map(r => Number(r.result)) ?? [], [tokenResults]);
  const stakedSet = useMemo(() => new Set((stakedNFTs ?? []).map(Number)), [stakedNFTs]);
  const unstakedTokenIds = useMemo(() => ownedTokenIds.filter(id => !stakedSet.has(id)), [ownedTokenIds, stakedSet]);

  // Writes
  const { writeContract: approveContract, data: approveHash } = useWriteContract();
  const { writeContract: stakeNFT, data: stakeHash } = useWriteContract();
  const { writeContract: stakeAllNFT, data: stakeAllHash } = useWriteContract();
  const { writeContract: unstakeNFT, data: unstakeHash } = useWriteContract();
  const { writeContract: emergencyNFT, data: emergencyHash } = useWriteContract();
  const { writeContract: claimNFT, data: claimHash } = useWriteContract();
  const { writeContract: claimAllNFT, data: claimAllHash } = useWriteContract();

  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isStakingAll } = useWaitForTransactionReceipt({ hash: stakeAllHash });
  const { isLoading: isUnstaking } = useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isLoading: isEmergency } = useWaitForTransactionReceipt({ hash: emergencyHash });
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({ hash: claimHash });
  const { isLoading: isClaimingAll } = useWaitForTransactionReceipt({ hash: claimAllHash });

  const refetchAll = useCallback(() => {
    setTimeout(() => { refetchStaked(); refetchBalance(); refetchApproval(); }, 3000);
  }, [refetchStaked, refetchBalance, refetchApproval]);

  const handleApprove = () => approveContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'setApprovalForAll', args: [STAKING_CONTRACT, true] });

  const handleStake = (tokenId: number, duration: number) => {
    stakeNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stake', args: [BigInt(tokenId), duration], value: stakeFee ?? parseEther('0.0001') });
    setStakeModalToken(null);
    refetchAll();
  };

  const handleStakeAll = (duration: number) => {
    if (!unstakedTokenIds.length) return;
    stakeAllNFT({
      address: STAKING_CONTRACT,
      abi: STAKING_ABI,
      functionName: 'stakeAll',
      args: [unstakedTokenIds.map(BigInt), duration],
      value: (stakeFee ?? parseEther('0.0001')) * BigInt(unstakedTokenIds.length),
    });
    setShowStakeAllModal(false);
    refetchAll();
  };

  const handleUnstake = (tokenId: number) => { unstakeNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(tokenId)] }); refetchAll(); };
  const handleEmergencyUnstake = (tokenId: number) => {
    emergencyNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'emergencyUnstake', args: [BigInt(tokenId)], value: parseEther('0.0002') });
    refetchAll();
  };
  const handleClaim = (tokenId: number) => { claimNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimRewards', args: [BigInt(tokenId)] }); refetchAll(); };
  const handleClaimAll = () => { claimAllNFT({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimAllRewards', args: [] }); refetchAll(); };

  const shackFormatted = shackBalance ? Math.floor(Number(formatEther(shackBalance))).toLocaleString() : '0';
  const stakedCount = stakedNFTs?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#060b18] overflow-x-hidden">
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {!isConnected ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-center mb-6">
                <Wallet size={28} className="text-[#fbbf24]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Stake Your SHACKOs</h1>
              <p className="text-gray-400 mb-8 max-w-sm text-sm">Connect your wallet to view your NFTs and start earning $SHACK on Base Mainnet</p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button onClick={openConnectModal} className="flex items-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                    Connect Wallet <ChevronRight size={16} />
                  </button>
                )}
              </ConnectButton.Custom>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-[#0d1525] via-[#0a1628] to-[#060b18] border border-blue-500/20 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <img src="/assets/Base.png" alt="Base" className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Live on Base Mainnet</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Stake NFTs &amp; Earn $SHACK</h1>
                    <p className="text-gray-400 text-sm max-w-md">Lock your SHACKO NFTs to earn $SHACK rewards. Longer locks earn bigger multipliers.</p>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Your $SHACK</p>
                      <p className="text-2xl font-bold text-[#fbbf24]">{shackFormatted}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Staked</p>
                      <p className="text-2xl font-bold text-emerald-400">{stakedCount}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Available</p>
                      <p className="text-2xl font-bold text-blue-400">{unstakedTokenIds.length}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  {stakedCount > 0 && (
                    <button onClick={handleClaimAll} disabled={isClaimingAll} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                      {isClaimingAll ? 'Claiming...' : 'Claim All Rewards'}
                    </button>
                  )}
                  {unstakedTokenIds.length > 1 && isApproved && (
                    <button onClick={() => setShowStakeAllModal(true)} disabled={isStakingAll} className="flex items-center gap-2 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24] font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50">
                      <Layers size={14} /> Stake All ({unstakedTokenIds.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Approve Banner */}
              {!isApproved && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">Approve Staking Contract</p>
                    <p className="text-gray-500 text-xs">One-time approval required before you can stake any NFTs</p>
                  </div>
                  <button onClick={handleApprove} disabled={isApproving} className="bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap">
                    {isApproving ? 'Approving...' : 'Approve Contract'}
                  </button>
                </div>
              )}

              {/* Staked NFTs */}
              {stakedNFTs && stakedNFTs.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Staked SHACKOs ({stakedNFTs.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {stakedNFTs.map((tokenId) => (
                      <StakedNFTCard
                        key={Number(tokenId)}
                        tokenId={Number(tokenId)}
                        onUnstake={handleUnstake}
                        onEmergencyUnstake={handleEmergencyUnstake}
                        onClaim={handleClaim}
                        isUnstaking={isUnstaking}
                        isEmergencyUnstaking={isEmergency}
                        isClaiming={isClaiming}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Unstaked NFTs */}
              {isApproved && unstakedTokenIds.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Your Unstaked SHACKOs ({unstakedTokenIds.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unstakedTokenIds.map((tokenId) => (
                      <UnstakedNFTCard
                        key={tokenId}
                        tokenId={tokenId}
                        onStake={(id) => setStakeModalToken(id)}
                        isStaking={isStaking && stakeModalToken === tokenId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tokenCount === 0 && (
                <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-16 text-center">
                  <Wallet size={32} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No SHACKO NFTs in your wallet</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {stakeModalToken !== null && (
          <DurationModal
            title={`Stake SHACKO #${stakeModalToken}`}
            subtitle="Choose a lock duration — longer locks earn bigger rewards"
            fee={stakeFee}
            count={1}
            onConfirm={(d) => handleStake(stakeModalToken, d)}
            onClose={() => setStakeModalToken(null)}
          />
        )}
        {showStakeAllModal && (
          <DurationModal
            title={`Stake All ${unstakedTokenIds.length} SHACKOs`}
            subtitle="All NFTs will be staked with the same lock duration"
            fee={stakeFee}
            count={unstakedTokenIds.length}
            onConfirm={handleStakeAll}
            onClose={() => setShowStakeAllModal(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ── UNSTAKED NFT CARD (with dynamic image from JSON) ─────────────────────────
function UnstakedNFTCard({ tokenId, onStake, isStaking }: {
  tokenId: number;
  onStake: (id: number) => void;
  isStaking: boolean;
}) {
  const { data: rarityData } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'tokenRarity',
    args: [BigInt(tokenId)],
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const rarity = (rarityData as string) || 'Common';
  const rCol = rarityColors[rarity] ?? rarityColors['Common'];
  const dailyBase = baseRateMap[rarity] ?? 10;

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
    <motion.div className={`bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all hover:shadow-xl ${rCol.glow}`}>
      <div className="relative w-full aspect-square bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={`SHACKO #${tokenId}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-5xl font-black text-white/10">#{tokenId}</p>
          </div>
        )}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold border ${rCol.bg} ${rCol.text} ${rCol.border} backdrop-blur-sm`}>
          {rarity}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-sm">SHACKO #{tokenId}</p>
          <p className="text-xs text-[#fbbf24] font-semibold">{dailyBase}/day base</p>
        </div>

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

// ── STAKED NFT CARD (with dynamic image + correct earnings) ───────────────────
function StakedNFTCard({
  tokenId,
  onUnstake,
  onEmergencyUnstake,
  onClaim,
  isUnstaking,
  isEmergencyUnstaking,
  isClaiming,
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
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [BigInt(tokenId)],
  });

  const { data: rarityData } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'tokenRarity',
    args: [BigInt(tokenId)],
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const [now, setNow] = useState(Date.now() / 1000);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(t);
  }, []);

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

  if (!stakeInfo) return <div className="bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden animate-pulse h-[420px]" />;

  const [, stakedAt, durationEnum, unlockTime] = stakeInfo as [string, bigint, number, bigint, bigint, boolean];
  const rarity = (rarityData as string) || 'Common';
  const isUnlocked = Number(unlockTime) <= now;
  const secondsLeft = Math.max(0, Number(unlockTime) - now);
  const progress = isUnlocked ? 100 : Math.min(100, ((now - Number(stakedAt)) / (Number(unlockTime) - Number(stakedAt))) * 100);

  const durInfo = DURATIONS[durationEnum] || DURATIONS[0];

  // Correct earnings per day matching contract
  const baseRate = baseRateMap[rarity] ?? 10;
  const rarityMult = rarityMultMap[rarity] ?? 100;
  const durationMult = durInfo.mult;
  const earningsPerDay = Math.round((baseRate * rarityMult * durationMult) / 10000);

  const rCol = rarityColors[rarity] ?? rarityColors['Common'];

  return (
    <motion.div className={`bg-[#0d1525] border rounded-2xl overflow-hidden transition-all ${isUnlocked ? 'border-emerald-500/30' : 'border-white/5'} hover:shadow-xl`}>
      <div className="relative w-full aspect-square bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
        {imageUrl && !imgError ? (
          <img src={imageUrl} alt={`SHACKO #${tokenId}`} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-5xl font-black text-white/10">#{tokenId}</p>
          </div>
        )}

        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold border ${rCol.bg} ${rCol.text} ${rCol.border}`}>
          {rarity}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 backdrop-blur-md ${isUnlocked ? 'bg-emerald-900/60' : 'bg-black/60'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Lock ends</span>
            <span className={`font-bold tabular-nums ${isUnlocked ? 'text-emerald-400' : 'text-white'}`}>
              {isUnlocked ? '✓ Ready' : formatCountdown(secondsLeft)}
            </span>
          </div>
          <div className="mt-1.5 w-full bg-white/10 rounded-full h-1">
            <div className={`h-full rounded-full transition-all \( {isUnlocked ? 'bg-emerald-400' : 'bg-[#fbbf24]'}`} style={{ width: ` \){progress}%` }} />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div>
            <p className="text-white font-bold text-sm">SHACKO #{tokenId}</p>
            <p className="text-xs text-gray-500">{durInfo.label} · {durInfo.multiplier}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Per Day</p>
            <p className="text-base font-bold text-[#fbbf24]">{earningsPerDay} $SHACK</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onClaim(tokenId)} disabled={isClaiming} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold py-2 rounded-xl text-sm">Claim</button>
          <button onClick={() => onUnstake(tokenId)} disabled={!isUnlocked || isUnstaking} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-semibold py-2 rounded-xl text-sm disabled:opacity-40">Unstake</button>
        </div>

        {!isUnlocked && (
          <button
            onClick={() => {
              if (confirm('⚠️ Emergency unstake forfeits ALL pending rewards and costs 0.0002 ETH. Continue?')) {
                onEmergencyUnstake(tokenId);
              }
            }}
            disabled={isEmergencyUnstaking}
            className="w-full mt-2 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium py-2 rounded-xl text-xs"
          >
            <AlertTriangle size={11} /> Emergency Unstake
          </button>
        )}
      </div>
    </motion.div>
  );
}