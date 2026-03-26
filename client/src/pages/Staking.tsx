"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';
import { useState, useEffect, useCallback } from "react";
import { Wallet, Lock, Unlock, Trophy, TrendingUp, Clock, Zap, X, AlertTriangle, ChevronRight, Layers } from "lucide-react";

// ── CONTRACTS ─────────────────────────────────────────────────────────────────
const SHACKO_NFT      = '0x7f30f4b6d5C98D29E32cf013558A01443c87C013';
const STAKING_CONTRACT = '0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5';
const SHACK_TOKEN     = '0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3';

// ── ABIs ──────────────────────────────────────────────────────────────────────
const NFT_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
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
  'function getStakeInfo(uint256 tokenId) view returns (address owner, uint256 stakedAt, uint8 duration, uint256 unlockTime, uint256 lastClaimTime, bool isStaked)',
]);

const SHACK_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
]);

const IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/bafybeihieoxvg36vedmbpmy2fx7nbdv6ka7vdyn5qcusmcw2ooz7bzmdqa";

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  'Common':    { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40' },
  'Uncommon':  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  'Rare':      { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/40' },
  'Epic':      { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40' },
  'Legendary': { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40' },
  'OneOfOne':  { bg: 'bg-rose-500/20',    text: 'text-rose-300',    border: 'border-rose-500/40' },
};

const baseRateMap: Record<string, number> = {
  'Common': 10, 'Uncommon': 15, 'Rare': 20, 'Epic': 40, 'Legendary': 70, 'OneOfOne': 100,
};

const DURATIONS = [
  { label: '7 Days',  multiplier: '1.0x',  icon: Zap },
  { label: '14 Days', multiplier: '1.25x', icon: TrendingUp },
  { label: '30 Days', multiplier: '1.5x',  icon: Trophy },
  { label: '60 Days', multiplier: '2.0x',  icon: Clock },
];

function formatCountdown(secondsLeft: number): string {
  if (secondsLeft <= 0) return 'Unlocked';
  const d = Math.floor(secondsLeft / 86400);
  const h = Math.floor((secondsLeft % 86400) / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`;
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Staking() {
  const { address, isConnected } = useAccount();
  const [stakeModalToken, setStakeModalToken] = useState<number | null>(null);

  // Reads
  const { data: nftBalance } = useReadContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'balanceOf', args: address ? [address] : undefined });
  const { data: isApproved, refetch: refetchApproval } = useReadContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'isApprovedForAll', args: address ? [address, STAKING_CONTRACT] : undefined });
  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes', args: address ? [address] : undefined });
  const { data: shackBalance } = useReadContract({ address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf', args: address ? [address] : undefined });
  const { data: stakeFee } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeFee' });

  // Token ID Logic
  const tokenCount = nftBalance ? Number(nftBalance) : 0;
  const { data: tokenResults } = useReadContracts({
    contracts: Array.from({ length: tokenCount }, (_, i) => ({ address: SHACKO_NFT as `0x${string}`, abi: NFT_ABI, functionName: 'tokenOfOwnerByIndex', args: [address!, BigInt(i)] })),
    query: { enabled: !!address && tokenCount > 0 },
  });

  const ownedTokenIds = tokenResults?.filter((r) => r.status === 'success').map((r) => Number(r.result)) ?? [];
  const stakedSet = new Set((stakedNFTs ?? []).map(Number));
  const unstakedTokenIds = ownedTokenIds.filter((id) => !stakedSet.has(id));

  // Writes
  const { writeContract } = useWriteContract();

  const handleApprove = () => writeContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'setApprovalForAll', args: [STAKING_CONTRACT, true] });
  const handleStake = (tokenId: number, duration: number) => {
    writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stake', args: [BigInt(tokenId), duration], value: stakeFee || parseEther('0.0001') });
    setStakeModalToken(null);
  };
  const handleUnstake = (tokenId: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(tokenId)] });
  const handleClaim = (tokenId: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimRewards', args: [BigInt(tokenId)] });

  return (
    <div className="min-h-screen bg-[#060b18] overflow-x-hidden pt-32 pb-20 px-4 md:px-8">
      <Header />
      <div className="max-w-6xl mx-auto">
        
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Staking Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Stake your SHACKO NFTs to earn $SHACK rewards on Base</p>
        </div>

        {/* Stats Section - Visible Always */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '$SHACK Balance', value: shackBalance ? Math.floor(Number(formatEther(shackBalance))).toLocaleString() : '0', icon: Trophy, color: 'text-[#fbbf24]', accent: 'bg-[#fbbf24]/10' },
            { label: 'Total NFTs', value: tokenCount.toString(), icon: Wallet, color: 'text-blue-400', accent: 'bg-blue-500/10' },
            { label: 'Staked NFTs', value: stakedNFTs ? stakedNFTs.length.toString() : '0', icon: Lock, color: 'text-emerald-400', accent: 'bg-emerald-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0d1525] border border-white/5 rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-lg ${stat.accent} flex items-center justify-center mb-3`}><stat.icon size={15} className={stat.color} /></div>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0d1525] to-[#0a1628] border border-blue-500/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
                <h2 className="text-white font-bold text-lg mb-1">Earn Daily Rewards</h2>
                <p className="text-gray-400 text-sm">Base Layer 2 Network Staking Protocol</p>
            </div>
            {!isConnected && <ConnectButton />}
        </div>

        {!isConnected ? (
          <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-12 text-center">
             <Wallet size={28} className="text-gray-600 mx-auto mb-3" />
             <p className="text-gray-500 text-sm mb-6">Connect your wallet to manage your NFTs</p>
             <ConnectButton />
          </div>
        ) : (
          <>
            {/* Approval Notice */}
            {!isApproved && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 flex justify-between items-center">
                <p className="text-sm text-amber-200">Approval needed before staking your first NFT</p>
                <button onClick={handleApprove} className="bg-[#fbbf24] text-black px-4 py-2 rounded-xl text-xs font-bold">Approve Now</button>
              </div>
            )}

            {/* Staked NFTs */}
            {stakedNFTs && stakedNFTs.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Staked SHACKOs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stakedNFTs.map((id) => <StakedNFTCard key={Number(id)} tokenId={Number(id)} onUnstake={handleUnstake} onClaim={handleClaim} />)}
                </div>
              </div>
            )}

            {/* Unstaked NFTs */}
            {unstakedTokenIds.length > 0 && (
               <div>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Wallet ({unstakedTokenIds.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unstakedTokenIds.map((id) => <UnstakedNFTCard key={id} tokenId={id} onStake={() => setStakeModalToken(id)} />)}
                  </div>
               </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {stakeModalToken !== null && (
          <DurationModal title={`Stake #${stakeModalToken}`} fee={stakeFee} onConfirm={(d) => handleStake(stakeModalToken, d)} onClose={() => setStakeModalToken(null)} />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function UnstakedNFTCard({ tokenId, onStake }: any) {
  const { data: rarity } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'tokenRarity', args: [BigInt(tokenId)] });
  const r = (rarity as string) || 'Common';
  const rCol = rarityColors[r] || rarityColors['Common'];

  return (
    <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-5">
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-slate-900">
        <img src={`${IPFS_GATEWAY}/${tokenId}.png`} alt={`#${tokenId}`} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://placehold.co/400"} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-white font-bold text-sm">SHACKO #{tokenId}</p>
        <span className={`px-2 py-0.5 rounded text-[10px] ${rCol.text} ${rCol.bg}`}>{r}</span>
      </div>
      <button onClick={onStake} className="w-full bg-[#fbbf24] text-black font-semibold py-2.5 rounded-xl text-sm">Stake NFT</button>
    </div>
  );
}

function StakedNFTCard({ tokenId, onUnstake, onClaim }: any) {
  const { data: stakeInfo } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getStakeInfo', args: [BigInt(tokenId)] });
  if (!stakeInfo) return <div className="animate-pulse bg-white/5 h-64 rounded-2xl" />;

  const [, , , unlockTime, pendingRewards] = stakeInfo as any;
  const isUnlocked = Number(unlockTime) <= (Date.now() / 1000);

  return (
    <div className="bg-[#0d1525] border border-white/10 rounded-2xl p-5">
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-4">
        <img src={`${IPFS_GATEWAY}/${tokenId}.png`} alt={`#${tokenId}`} className="w-full h-full object-cover" />
      </div>
      <div className="flex justify-between items-start mb-4">
        <p className="text-white font-bold">#{tokenId}</p>
        <div className="text-right">
            <p className="text-xs text-gray-500">Earnings</p>
            <p className="text-emerald-400 font-bold">{Math.floor(Number(formatEther(pendingRewards)))} $SHACK</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onClaim(tokenId)} className="flex-1 bg-emerald-500/10 text-emerald-400 py-2 rounded-xl text-xs font-bold">Claim</button>
        <button onClick={() => onUnstake(tokenId)} disabled={!isUnlocked} className="flex-1 bg-blue-500/10 text-blue-400 py-2 rounded-xl text-xs font-bold disabled:opacity-20">Unstake</button>
      </div>
    </div>
  );
}

function DurationModal({ title, onConfirm, onClose, fee }: any) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0d1525] border border-white/10 rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-white font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {DURATIONS.map((d, i) => (
            <button key={i} onClick={() => setSelected(i)} className={`p-3 rounded-xl border text-left ${selected === i ? 'bg-[#fbbf24]/10 border-[#fbbf24]/40 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}>
              <p className="text-xs font-bold">{d.label}</p>
              <p className="text-[10px]">{d.multiplier} Boost</p>
            </button>
          ))}
        </div>
        <button onClick={() => onConfirm(selected)} className="w-full bg-[#fbbf24] text-black font-bold py-3 rounded-xl">Stake Now</button>
      </div>
    </div>
  );
}