"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useAccount, useReadContract, useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { parseAbi, formatEther, parseEther, getAddress } from "viem";
import { 
  Wallet, Zap, Coins, LayoutGrid, Plus, Minus, CheckCircle2, Loader2, ExternalLink, TrendingUp
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ── MAINNET CONFIGURATION ──────────────────────────────────────────────────
const SHACKO_NFT = getAddress('0x7f30f4b6d5C98D29E32cf013558A01443c87C013');
const STAKING_CONTRACT = getAddress('0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5');
const SHACK_TOKEN = getAddress('0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3');

const NFT_ABI = parseAbi(['function tokensOfOwner(address owner) view returns (uint256[])']);
const STAKING_ABI = parseAbi([
  'function stakeAll(uint256[] tokenIds, uint8 duration) payable',
  'function unstake(uint256 tokenId)',
  'function claimRewards(uint256 tokenId)',
  'function claimAllRewards()',
  'function getUserStakes(address user) view returns (uint256[])',
  'function getStakeInfo(uint256 tokenId) view returns (address owner, uint256 stakedAt, uint256 unlockTime, uint256 pendingRewards, bool isStaked, string rarity)',
]);

// ── COMPONENT: NFT CARD (HANDLES BOTH STAKED & UNSTAKED) ───────────────────
function NFTCard({ tokenId, isStaked, onAction }: any) {
  const [metadata, setMetadata] = useState<any>(null);
  const { data: stakeInfo } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getStakeInfo', 
    args: [BigInt(tokenId)], query: { enabled: isStaked }
  });

  useEffect(() => {
    fetch(`https://gateway.lighthouse.storage/ipfs/bafybeifbjqcpmzdp7cu7elgegetznctxiwdibjdsjmlz7ck2lkfy3gzaey/${tokenId}.json`)
      .then(res => res.json()).then(setMetadata).catch(console.error);
  }, [tokenId]);

  if (!metadata) return <div className="h-80 bg-[#0d1525] animate-pulse rounded-3xl border border-white/5" />;

  const pending = stakeInfo ? Math.floor(Number(formatEther(stakeInfo[3]))) : 0;
  const isUnlocked = stakeInfo ? Number(stakeInfo[2]) <= Math.floor(Date.now() / 1000) : false;

  return (
    <motion.div layout className="bg-[#0d1525] border border-white/10 rounded-3xl p-4 shadow-xl group">
      <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
        <img src={metadata.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {isStaked && <span className="absolute top-2 right-2 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 backdrop-blur-md">STAKED</span>}
      </div>
      <div className="mb-4">
        <h3 className="font-black text-lg tracking-tight">SHACKO #{tokenId}</h3>
        {isStaked && <p className="text-emerald-400 font-black text-sm">+{pending.toLocaleString()} SHACK</p>}
      </div>
      <button 
        onClick={() => onAction(tokenId)}
        className={`w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
          isStaked ? (isUnlocked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/5 text-gray-500 cursor-not-allowed') 
          : 'bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
        }`}
      >
        {isStaked ? (isUnlocked ? 'Unstake' : 'Locked') : 'Stake Now'}
      </button>
    </motion.div>
  );
}

export default function StakingPage() {
  const { address, isConnected } = useAccount();
  const [stakeInput, setStakeInput] = useState("1");
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: ownedIds } = useReadContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'tokensOfOwner', args: address ? [address] : undefined });
  const { data: stakedNFTs } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes', args: address ? [address] : undefined });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stakedIds = useMemo(() => (stakedNFTs || []).map(Number), [stakedNFTs]);
  const unstakedIds = useMemo(() => (ownedIds || []).map(Number).filter(id => !stakedIds.includes(id)), [ownedIds, stakedIds]);

  useEffect(() => { if (isSuccess) { setShowSuccess(true); setTimeout(() => setShowSuccess(false), 5000); }}, [isSuccess]);

  return (
    <div className="min-h-screen bg-[#060b18] text-white">
      <Header />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {!isConnected ? (
          <div className="flex flex-col items-center py-24 bg-[#0d1525] rounded-[40px] border border-white/5"><ConnectButton /></div>
        ) : (
          <>
            {/* ── THE OASIS DASHBOARD (STATS) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="bg-[#0d1525] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Rewards Available</p>
                  <div className="flex items-center justify-between">
                    <p className="text-4xl font-black text-emerald-400 tracking-tighter italic">CLAIM ALL</p>
                    <button onClick={() => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimAllRewards' })} className="p-4 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 rounded-2xl transition-all"><Coins size={24} /></button>
                  </div>
               </div>
               <div className="bg-[#0d1525] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Wallet Balance</p>
                  <p className="text-4xl font-black text-blue-400 tracking-tighter">{unstakedIds.length} <span className="text-sm text-gray-600 uppercase">Shacks</span></p>
               </div>
               <div className="bg-[#0d1525] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Staked</p>
                  <p className="text-4xl font-black text-purple-400 tracking-tighter">{stakedIds.length} <span className="text-sm text-gray-600 uppercase">In Oasis</span></p>
               </div>
            </div>

            {/* ── BULK STAKE CONTROL ── */}
            {unstakedIds.length > 0 && (
              <div className="bg-[#0d1525] border border-blue-500/30 rounded-[32px] p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20"><Zap className="text-blue-400 fill-blue-400/20" /></div>
                    <div><h3 className="text-xl font-black tracking-tight uppercase italic">Bulk Deploy</h3><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select amount to stake at once</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1.5">
                    <button onClick={() => setStakeInput(p => Math.max(1, (parseInt(p) || 0) - 1).toString())} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all font-bold active:scale-90"><Minus size={16} /></button>
                    <input type="number" value={stakeInput} onChange={(e) => setStakeInput(Math.max(1, Math.min(unstakedIds.length, parseInt(e.target.value) || 0)).toString())} className="w-16 bg-transparent text-center text-xl font-black text-blue-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button onClick={() => setStakeInput(p => Math.min(unstakedIds.length, (parseInt(p) || 0) + 1).toString())} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all font-bold active:scale-90"><Plus size={16} /></button>
                    <button onClick={() => setStakeInput(unstakedIds.length.toString())} className="px-3 ml-2 text-[10px] font-black bg-blue-500/20 text-blue-400 rounded-lg h-10 hover:bg-blue-500 hover:text-white transition-all">MAX</button>
                  </div>
                  <button onClick={() => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeAll', args: [unstakedIds.slice(0, parseInt(stakeInput)).map(BigInt), 30], value: parseEther('0.0001') * BigInt(stakeInput) })} className="px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all uppercase text-xs tracking-widest flex items-center gap-2">
                    {(isPending || isConfirming) ? <Loader2 className="animate-spin" size={16} /> : "Stake All"}
                  </button>
                </div>
              </div>
            )}

            {/* ── WALLET (UNSTAKED) GRID ── */}
            <div className="mb-20">
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3 italic"><TrendingUp className="text-blue-500" /> Wallet Inventory ({unstakedIds.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {unstakedIds.map(id => <NFTCard key={id} tokenId={id} isStaked={false} onAction={(tid: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeAll', args: [[BigInt(tid)], 30], value: parseEther('0.0001') })} />)}
              </div>
            </div>

            {/* ── OASIS (STAKED) GRID ── */}
            <div>
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3 italic text-emerald-400"><LayoutGrid /> Staked in Oasis ({stakedIds.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stakedIds.map(id => <NFTCard key={id} tokenId={id} isStaked={true} onAction={(tid: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(tid)] })} />)}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
