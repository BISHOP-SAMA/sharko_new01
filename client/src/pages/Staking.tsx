"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alchemy, Network, Nft } from "alchemy-sdk";
import { 
  useAccount, useReadContract, useWriteContract, 
  useWaitForTransactionReceipt, useBalance 
} from "wagmi";
import { parseAbi, formatEther, parseEther, getAddress } from "viem";
import { 
  Wallet, Zap, TrendingUp, Trophy, Clock, X, 
  AlertTriangle, ChevronRight, Layers, Loader2, ExternalLink 
} from "lucide-react";

import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ── CONFIGURATION ──────────────────────────────────────────────────────────
const SHACKO_NFT = getAddress('0x7f30f4b6d5C98D29E32cf013558A01443c87C013');
const STAKING_CONTRACT = getAddress('0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5');
const SHACK_TOKEN = getAddress('0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3');

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
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
  'function claimRewards(uint256 tokenId)',
  'function claimAllRewards()',
  'function getUserStakes(address user) view returns (uint256[])',
  'function stakeFee() view returns (uint256)',
]);

const SHACK_ABI = parseAbi(['function balanceOf(address account) view returns (uint256)']);

const DURATIONS = [
  { label: '7 Days',  multiplier: '1.0x',  icon: Zap,        value: 0 },
  { label: '14 Days', multiplier: '1.25x', icon: TrendingUp, value: 1 },
  { label: '30 Days', multiplier: '1.5x',  icon: Trophy,     value: 2 },
  { label: '60 Days', multiplier: '2.0x',  icon: Clock,      value: 3 },
];

// ── COMPONENTS ──────────────────────────────────────────────────────────────

function NFTCard({ tokenId, nft, onAction, actionLabel, isLoading }: any) {
  // Alchemy CDN is primary, Lighthouse is backup
  const imageUrl = nft?.image?.cachedUrl || 
    `https://gateway.lighthouse.storage/ipfs/bafybeifbjqcpmzdp7cu7elgegetznctxiwdibjdsjmlz7ck2lkfy3gzaey/${tokenId}.png`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-3 hover:border-[#fbbf24]/30 transition-colors"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-black/20">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-tight">
          ID #{tokenId}
        </div>
      </div>
      <button
        onClick={() => onAction(tokenId)}
        disabled={isLoading}
        className="w-full py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 size={14} className="animate-spin" />}
        {actionLabel}
      </button>
    </motion.div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function StakingPage() {
  const { address, isConnected } = useAccount();
  
  // States
  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [isLoadingAlchemy, setIsLoadingAlchemy] = useState(false);
  const [stakeModalToken, setStakeModalToken] = useState<number | null>(null);
  const [showStakeAllModal, setShowStakeAllModal] = useState(false);

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

  // Alchemy Fetch
  const fetchNFTs = useCallback(async () => {
    if (!address) return;
    setIsLoadingAlchemy(true);
    try {
      const res = await alchemy.nft.getNftsForOwner(address, { contractAddresses: [SHACKO_NFT] });
      setOwnedNfts(res.ownedNfts);
    } catch (e) { console.error(e); }
    finally { setIsLoadingAlchemy(false); }
  }, [address]);

  useEffect(() => { fetchNFTs(); }, [fetchNFTs]);

  // Wagmi Writes
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isTxPending } = useWaitForTransactionReceipt({ 
    hash, 
    onSuccess: () => {
      refetchStaked();
      refetchApproval();
      refetchShack();
      fetchNFTs();
    }
  });

  const handleApprove = () => writeContract({ 
    address: SHACKO_NFT, abi: NFT_ABI, functionName: 'setApprovalForAll', args: [STAKING_CONTRACT, true] 
  });

  const handleStake = (tokenId: number, duration: number) => {
    writeContract({
      address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stake',
      args: [BigInt(tokenId), duration],
      value: stakeFee ?? parseEther('0.0001')
    });
    setStakeModalToken(null);
  };

  const handleClaimAll = () => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimAllRewards' });

  // Memoized lists
  const stakedIds = useMemo(() => (stakedNFTs || []).map(Number), [stakedNFTs]);
  const unstakedNfts = useMemo(() => ownedNfts.filter(n => !stakedIds.includes(Number(n.tokenId))), [ownedNfts, stakedIds]);

  return (
    <div className="min-h-screen bg-[#060b18] text-white selection:bg-[#fbbf24]/30">
      <Header />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#fbbf24]/10 rounded-full flex items-center justify-center mb-6 border border-[#fbbf24]/20">
              <Wallet className="text-[#fbbf24]" size={32} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Stake your Shackos</h1>
            <p className="text-gray-400 mb-8 max-w-md">Connect your wallet to manage your NFTs and start earning $SHACK rewards.</p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Your Rewards</p>
                <h2 className="text-3xl font-bold text-[#fbbf24]">
                  {shackBalance ? Math.floor(Number(formatEther(shackBalance))).toLocaleString() : '0'} <span className="text-sm font-normal text-gray-400">$SHACK</span>
                </h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Staked Sharks</p>
                <h2 className="text-3xl font-bold text-emerald-400">{stakedIds.length}</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-end justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Available</p>
                  <h2 className="text-3xl font-bold text-blue-400">{unstakedNfts.length}</h2>
                </div>
                {stakedIds.length > 0 && (
                  <button onClick={handleClaimAll} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-bold transition-all">
                    Claim All
                  </button>
                )}
              </div>
            </div>

            {/* Approval Banner */}
            {!isApproved && (
              <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="text-[#fbbf24]" />
                  <div>
                    <h3 className="font-bold">Approve Staking</h3>
                    <p className="text-sm text-gray-400">You need to approve the contract to manage your NFTs before staking.</p>
                  </div>
                </div>
                <button onClick={handleApprove} className="w-full md:w-auto px-8 py-3 bg-[#fbbf24] text-black font-bold rounded-xl hover:scale-105 transition-transform">
                  Approve Now
                </button>
              </div>
            )}

            {/* NFT Grids */}
            <div className="space-y-12">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    Available Sharks <span className="text-gray-500 text-sm font-normal">({unstakedNfts.length})</span>
                  </h2>
                </div>
                {isLoadingAlchemy ? (
                  <div className="flex items-center gap-3 text-gray-500"><Loader2 className="animate-spin" /> Fetching from Base...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {unstakedNfts.map(nft => (
                      <NFTCard 
                        key={nft.tokenId} 
                        tokenId={nft.tokenId} 
                        nft={nft} 
                        actionLabel="Stake" 
                        onAction={() => setStakeModalToken(Number(nft.tokenId))}
                      />
                    ))}
                  </div>
                )}
              </section>

              {stakedIds.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Staked Sharks <span className="text-emerald-500 text-sm font-normal">({stakedIds.length})</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {stakedIds.map(id => (
                      <NFTCard 
                        key={id} 
                        tokenId={id} 
                        actionLabel="Unstake" 
                        onAction={(id: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(id)] })}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </main>

      {/* Duration Modal */}
      <AnimatePresence>
        {stakeModalToken !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="bg-[#0d1525] border border-white/10 rounded-3xl p-8 max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-2">Select Duration</h2>
              <p className="text-gray-400 text-sm mb-6">Locking your shark for longer increases your multiplier.</p>
              <div className="space-y-3 mb-8">
                {DURATIONS.map((d) => (
                  <button 
                    key={d.value}
                    onClick={() => handleStake(stakeModalToken, d.value)}
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
              <button onClick={() => setStakeModalToken(null)} className="w-full text-gray-500 font-medium py-2">Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
