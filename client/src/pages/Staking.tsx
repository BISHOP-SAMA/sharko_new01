"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alchemy, Network, Nft } from "alchemy-sdk";
import { 
  useAccount, useReadContract, useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { parseAbi, formatEther, parseEther, getAddress } from "viem";
import { 
  Wallet, Zap, TrendingUp, Trophy, Clock, X, 
  AlertTriangle, ChevronRight, Loader2, Lock, ShieldAlert 
} from "lucide-react";

import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ── CONFIGURATION ──────────────────────────────────────────────────────────
const SHACKO_NFT = getAddress('0x7f30f4b6d5C98D29E32cf013558A01443c87C013');
const STAKING_CONTRACT = getAddress('0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5');
const SHACK_TOKEN = getAddress('0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3');

const alchemy = new Alchemy({
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY, 
  network: Network.BASE_MAINNET,
});

// ── ABIs ────────────────────────────────────────────────────────────────────
const NFT_ABI = parseAbi([
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
  'function stakeFee() view returns (uint256)',
]);

const SHACK_ABI = parseAbi(['function balanceOf(address account) view returns (uint256)']);

const DURATIONS = [
  { label: '7 Days',  multiplier: '1.0x',  icon: Zap,        value: 0, mult: 100 },
  { label: '14 Days', multiplier: '1.25x', icon: TrendingUp, value: 1, mult: 125 },
  { label: '30 Days', multiplier: '1.5x',  icon: Trophy,     value: 2, mult: 150 },
  { label: '60 Days', multiplier: '2.0x',  icon: Clock,      value: 3, mult: 200 },
];

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  'Common':    { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40' },
  'Uncommon':  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  'Rare':      { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/40' },
  'Epic':      { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40' },
  'Legendary': { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40' },
};

// ── STAKED NFT CARD COMPONENT ──────────────────────────────────────────────
function StakedNFTCard({ tokenId, nftData, onUnstake, onClaim, onEmergency }: any) {
  const { data: stakeInfo } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getStakeInfo', args: [BigInt(tokenId)],
  });

  if (!stakeInfo) return <div className="h-48 bg-white/5 animate-pulse rounded-2xl" />;

  const [owner, stakedAt, unlockTime, pendingRewards, isStaked, rarity] = stakeInfo;
  const now = Math.floor(Date.now() / 1000);
  const isUnlocked = Number(unlockTime) <= now;
  const progress = isUnlocked ? 100 : Math.min(100, ((now - Number(stakedAt)) / (Number(unlockTime) - Number(stakedAt))) * 100);
  const timeLeft = Math.max(0, Number(unlockTime) - now);
  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);

  const rCol = rarityColors[rarity] || rarityColors['Common'];
  const imageUrl = nftData?.image?.cachedUrl || `https://gateway.lighthouse.storage/ipfs/bafybeifbjqcpmzdp7cu7elgegetznctxiwdibjdsjmlz7ck2lkfy3gzaey/${tokenId}.png`;

  return (
    <motion.div layout className="bg-[#0d1525] border border-white/5 rounded-2xl p-4 overflow-hidden">
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm">Shacko #{tokenId}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${rCol.bg} ${rCol.text} ${rCol.border}`}>{rarity}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Pending Rewards</p>
          <p className="text-emerald-400 font-bold">{Math.floor(Number(formatEther(pendingRewards))).toLocaleString()} $SHACK</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] mb-1 text-gray-500 uppercase">
          <span>{isUnlocked ? 'Unlocked' : 'Staked'}</span>
          <span>{days}d {hours}h left</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onClaim(tokenId)} className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">Claim</button>
        <button onClick={() => onUnstake(tokenId)} disabled={!isUnlocked} className="py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20 disabled:opacity-30">Unstake</button>
      </div>
      {!isUnlocked && (
        <button onClick={() => onEmergency(tokenId)} className="w-full mt-2 py-2 text-[10px] text-red-400/50 hover:text-red-400 flex items-center justify-center gap-1 transition-colors">
          <ShieldAlert size={10} /> Emergency Unstake
        </button>
      )}
    </motion.div>
  );
}

// ── MAIN STAKING PAGE ───────────────────────────────────────────────────────
export default function StakingPage() {
  const { address, isConnected } = useAccount();
  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [isLoadingAlchemy, setIsLoadingAlchemy] = useState(false);
  const [stakeModalToken, setStakeModalToken] = useState<number | null>(null);

  // Wagmi Reads
  const { data: stakedNFTs, refetch: refetchStaked } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes', args: address ? [address] : undefined,
  });
  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'isApprovedForAll', args: address ? [address, STAKING_CONTRACT] : undefined,
  });
  const { data: shackBalance, refetch: refetchShack } = useReadContract({
    address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf', args: address ? [address] : undefined,
  });
  const { data: stakeFee } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeFee'
  });

  const fetchNFTs = useCallback(async () => {
    if (!address) return;
    setIsLoadingAlchemy(true);
    try {
      const res = await alchemy.nft.getNftsForOwner(address, { contractAddresses: [SHACKO_NFT] });
      setOwnedNfts(res.ownedNfts);
    } catch (e) { console.error(e); }
    finally { setIsLoadingAlchemy(false); }
  }, [address]);

  useEffect(() => { if (isConnected) fetchNFTs(); }, [isConnected, fetchNFTs]);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isTxPending } = useWaitForTransactionReceipt({ 
    hash, 
    onSuccess: () => { 
      refetchStaked(); refetchApproval(); refetchShack(); fetchNFTs(); 
    } 
  });

  const stakedIds = useMemo(() => (stakedNFTs || []).map(Number), [stakedNFTs]);
  const unstakedNfts = useMemo(() => ownedNfts.filter(n => !stakedIds.includes(Number(n.tokenId))), [ownedNfts, stakedIds]);

  return (
    <div className="min-h-screen bg-[#060b18] text-white">
      <Header />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#fbbf24]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#fbbf24]/20"><Wallet className="text-[#fbbf24]" size={28} /></div>
            <h1 className="text-3xl font-bold mb-2">Stake Your Shackos</h1>
            <p className="text-gray-400 mb-8 max-w-sm text-sm">Connect wallet to earn rewards on Base.</p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Stats Header - Restored Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'xSHACK Balance', value: shackBalance ? Math.floor(Number(formatEther(shackBalance))).toLocaleString() : '0', icon: Trophy, color: 'text-[#fbbf24]', bg: 'bg-[#fbbf24]/10' },
                { label: 'Owned Shackos', value: ownedNfts.length.toString(), icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Currently Staked', value: stakedIds.length.toString(), icon: Lock, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0d1525] border border-white/5 rounded-2xl p-5">
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}><stat.icon size={16} className={stat.color} /></div>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Stake All Banner */}
            {unstakedNfts.length > 0 && isApproved && (
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 mb-12 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Bulk Staking Available</h3>
                  <p className="text-sm text-gray-400">Stake all {unstakedNfts.length} available Shackos in one transaction.</p>
                </div>
                <button 
                  onClick={() => writeContract({
                    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeAll',
                    args: [unstakedNfts.map(n => BigInt(n.tokenId)), 0], // Default 7 days
                    value: (stakeFee || parseEther('0.0001')) * BigInt(unstakedNfts.length)
                  })}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  Stake All
                </button>
              </div>
            )}

            {/* Main Sections */}
            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold mb-6">Staked Sharks ({stakedIds.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stakedIds.map(id => (
                    <StakedNFTCard 
                      key={id} 
                      tokenId={id} 
                      nftData={ownedNfts.find(n => Number(n.tokenId) === id)}
                      onClaim={(id: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimRewards', args: [BigInt(id)] })}
                      onUnstake={(id: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(id)] })}
                      onEmergency={(id: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'emergencyUnstake', args: [BigInt(id)], value: parseEther('0.0002') })}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-6">Available to Stake ({unstakedNfts.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 opacity-80">
                  {unstakedNfts.map(nft => (
                    <div key={nft.tokenId} className="bg-white/5 border border-white/10 rounded-2xl p-3">
                      <img src={nft.image?.cachedUrl} alt="" className="aspect-square object-cover rounded-xl mb-3" />
                      <button 
                        onClick={() => setStakeModalToken(Number(nft.tokenId))}
                        className="w-full py-2 bg-[#fbbf24] text-black text-xs font-bold rounded-lg"
                      >
                        Stake #{nft.tokenId}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      {/* Duration Modal Integration */}
      <AnimatePresence>
        {stakeModalToken !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="bg-[#0d1525] border border-white/10 rounded-3xl p-8 max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-6">Select Duration</h2>
              <div className="space-y-3">
                {DURATIONS.map((d) => (
                  <button 
                    key={d.value}
                    onClick={() => {
                      writeContract({
                        address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stake',
                        args: [BigInt(stakeModalToken), d.value],
                        value: stakeFee || parseEther('0.0001')
                      });
                      setStakeModalToken(null);
                    }}
                    className="w-full p-4 bg-white/5 hover:bg-[#fbbf24]/10 border border-white/5 hover:border-[#fbbf24]/40 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <d.icon size={18} className="text-gray-500 group-hover:text-[#fbbf24]" />
                      <span className="font-bold">{d.label}</span>
                    </div>
                    <span className="text-[#fbbf24] font-bold">{d.multiplier}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStakeModalToken(null)} className="w-full text-gray-500 font-medium py-4 mt-4">Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
