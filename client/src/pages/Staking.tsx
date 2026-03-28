"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useAccount, useReadContract, useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { parseAbi, formatEther, parseEther, getAddress } from "viem";
import { 
  Wallet, Zap, Clock, Coins, LayoutGrid, Plus, Minus, CheckCircle2, Loader2, ExternalLink
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ── MAINNET CONFIGURATION ──────────────────────────────────────────────────
const SHACKO_NFT = getAddress('0x7f30f4b6d5C98D29E32cf013558A01443c87C013');
const STAKING_CONTRACT = getAddress('0xCb5EA03fdEF2FfC793d2fF4811477f3c20d4Fda5');
const SHACK_TOKEN = getAddress('0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3');

const NFT_ABI = parseAbi([
  'function tokensOfOwner(address owner) view returns (uint256[])',
]);

const STAKING_ABI = parseAbi([
  'function stakeAll(uint256[] tokenIds, uint8 duration) payable',
  'function unstake(uint256 tokenId)',
  'function claimRewards(uint256 tokenId)',
  'function claimAllRewards()',
  'function getUserStakes(address user) view returns (uint256[])',
  'function getStakeInfo(uint256 tokenId) view returns (address owner, uint256 stakedAt, uint256 unlockTime, uint256 pendingRewards, bool isStaked, string rarity)',
]);

const SHACK_ABI = parseAbi(['function balanceOf(address account) view returns (uint256)']);

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  'Common':    { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40' },
  'Uncommon':  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  'Rare':      { bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/40' },
  'Epic':      { bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40' },
  'Legendary': { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40' },
};

// ── COMPONENT: STAKED NFT CARD (WITH JSON FETCHING) ─────────────────────────
function StakedNFTCard({ tokenId, onUnstake, onClaim }: any) {
  const [metadata, setMetadata] = useState<any>(null);
  
  const { data: stakeInfo } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getStakeInfo', args: [BigInt(tokenId)],
  });

  // FETCH THE ACTUAL IMAGE FROM THE JSON
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`https://gateway.lighthouse.storage/ipfs/bafybeifbjqcpmzdp7cu7elgegetznctxiwdibjdsjmlz7ck2lkfy3gzaey/${tokenId}.json`);
        const json = await res.json();
        setMetadata(json);
      } catch (e) { console.error("Metadata fetch error", e); }
    };
    fetchMetadata();
  }, [tokenId]);

  if (!stakeInfo || !metadata) return <div className="h-80 bg-white/5 animate-pulse rounded-3xl border border-white/10" />;

  const [,, unlockTime, pendingRewards,, rarity] = stakeInfo;
  const now = Math.floor(Date.now() / 1000);
  const isUnlocked = Number(unlockTime) <= now;
  const timeLeft = Math.max(0, Number(unlockTime) - now);
  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);

  const rCol = rarityColors[rarity] || rarityColors['Common'];

  return (
    <motion.div layout className="bg-[#0d1525] border border-white/10 rounded-3xl p-4 shadow-2xl shadow-black/50">
      <div className="relative mb-4 overflow-hidden rounded-2xl">
        <img src={metadata.image} alt="" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-700" />
        <span className={`absolute top-2 right-2 text-[10px] font-black px-3 py-1 rounded-full border backdrop-blur-md ${rCol.bg} ${rCol.text} ${rCol.border}`}>{rarity}</span>
      </div>
      <div className="mb-4 px-1">
        <h3 className="font-black text-lg tracking-tight uppercase">SHACKO #{tokenId}</h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rewards: <span className="text-emerald-400">{Math.floor(Number(formatEther(pendingRewards))).toLocaleString()} SHACK</span></p>
      </div>
      <div className="bg-black/40 p-3 rounded-2xl border border-white/5 mb-4">
        <div className="flex justify-between text-[10px] mb-1 font-black uppercase text-gray-500">
          <span>{isUnlocked ? "READY TO HARVEST" : "LOCKED"}</span>
          <span>{days}D {hours}H</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-blue-500'}`} style={{ width: isUnlocked ? '100%' : '70%' }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onClaim(tokenId)} className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-[11px] font-black rounded-xl border border-emerald-500/20 transition-all uppercase">Claim</button>
        <button onClick={() => onUnstake(tokenId)} disabled={!isUnlocked} className="py-2.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white text-[11px] font-black rounded-xl border border-blue-500/20 disabled:opacity-20 transition-all uppercase">Unstake</button>
      </div>
    </motion.div>
  );
}

// ── COMPONENT: MAIN PAGE ────────────────────────────────────────────────────
export default function StakingPage() {
  const { address, isConnected } = useAccount();
  const [stakeInput, setStakeInput] = useState("1");
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: ownedIds } = useReadContract({ address: SHACKO_NFT, abi: NFT_ABI, functionName: 'tokensOfOwner', args: address ? [address] : undefined });
  const { data: stakedNFTs } = useReadContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'getUserStakes', args: address ? [address] : undefined });
  const { data: shackBalance } = useReadContract({ address: SHACK_TOKEN, abi: SHACK_ABI, functionName: 'balanceOf', args: address ? [address] : undefined });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stakedIds = useMemo(() => (stakedNFTs || []).map(Number), [stakedNFTs]);
  const unstakedIds = useMemo(() => (ownedIds || []).map(Number).filter(id => !stakedIds.includes(id)), [ownedIds, stakedIds]);

  // TRIGGER SUCCESS MODAL
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Auto-hide after 5s
    }
  }, [isSuccess]);

  const handleBulkStake = () => {
    const amount = parseInt(stakeInput);
    if (!amount || unstakedIds.length === 0) return;
    const selected = unstakedIds.slice(0, amount).map(id => BigInt(id));
    writeContract({
      address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stakeAll',
      args: [selected, 30], 
      value: parseEther('0.0001') * BigInt(selected.length)
    });
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-white">
      <Header />

      {/* SUCCESS NOTIFICATION */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] flex items-center gap-4 border border-white/20"
          >
            <CheckCircle2 size={24} className="animate-bounce" />
            <div>
              <p className="font-black uppercase text-sm tracking-tighter">Transaction Confirmed!</p>
              <p className="text-[10px] font-bold opacity-80 uppercase">Your Sharks are now swimming in the Oasis</p>
            </div>
            {hash && (
              <a href={`https://basescan.org/tx/${hash}`} target="_blank" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                <ExternalLink size={16} />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {!isConnected ? (
          <div className="flex flex-col items-center py-20 bg-[#0d1525] rounded-[40px] border border-white/5 shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 animate-pulse"><Wallet className="text-blue-400" /></div>
            <h1 className="text-3xl font-black mb-6 tracking-tighter uppercase">Connect to Mainnet</h1>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* OASIS DASHBOARD HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <div className="bg-[#0d1525] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">SHACK Balance</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-black text-emerald-400">{shackBalance ? Math.floor(Number(formatEther(shackBalance))).toLocaleString() : '0'}</p>
                    <button onClick={() => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimAllRewards' })} className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/20 transition-all active:scale-95"><Coins size={18} /></button>
                  </div>
               </div>
               <div className="bg-[#0d1525] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Owned</p>
                  <p className="text-3xl font-black text-blue-400">{(ownedIds || []).length}</p>
               </div>
               <div className="bg-[#0d1525] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Staked Sharks</p>
                  <p className="text-3xl font-black text-purple-400">{stakedIds.length}</p>
               </div>
            </div>

            {/* TYPEABLE BULK STAKING */}
            {unstakedIds.length > 0 && (
              <div className="bg-[#0d1525] border border-blue-500/20 rounded-[32px] p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-inner"><Zap className="text-blue-400" size={24} /></div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight uppercase">Bulk Staking</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fast-track multiple Sharks at once</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1.5">
                    <button onClick={() => setStakeInput(p => Math.max(1, (parseInt(p) || 0) - 1).toString())} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all font-bold active:scale-90"><Minus size={16} /></button>
                    <input type="number" value={stakeInput} onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") { setStakeInput(""); return; }
                      const num = parseInt(val);
                      if (!isNaN(num)) setStakeInput(Math.max(1, Math.min(unstakedIds.length, num)).toString());
                    }} className="w-16 bg-transparent text-center text-xl font-black text-blue-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button onClick={() => setStakeInput(p => Math.min(unstakedIds.length, (parseInt(p) || 0) + 1).toString())} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all font-bold active:scale-90"><Plus size={16} /></button>
                  </div>
                  <button onClick={handleBulkStake} disabled={isPending || isConfirming} className="px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all uppercase text-xs tracking-widest flex items-center gap-2 active:scale-95 disabled:opacity-50">
                    {(isPending || isConfirming) ? <Loader2 className="animate-spin" size={16} /> : null}
                    Stake {stakeInput} Sharks
                  </button>
                </div>
              </div>
            )}

            {/* GRID SECTION */}
            <section className="space-y-12">
              <div>
                <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-2"><LayoutGrid className="text-blue-500" size={20} /> Staked Collection ({stakedIds.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stakedIds.map(id => (
                    <StakedNFTCard key={id} tokenId={id} 
                      onClaim={(id: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimRewards', args: [BigInt(id)] })}
                      onUnstake={(id: number) => writeContract({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [BigInt(id)] })}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
