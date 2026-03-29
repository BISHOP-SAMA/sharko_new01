"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi, formatEther } from "viem";
import { Ticket, Trophy, Users, Zap, Gift, CheckCircle, ExternalLink, Info } from "lucide-react";

// --- CONTRACT CONFIG ---
const SHACK_TOKEN_ADDRESS = "0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3" as `0x${string}`;
const MULTI_RAFFLE_ADDRESS = "0xAC9fF7A959dEAe07080ABAA8850F01e7D06B5480" as `0x${string}`;
const IPFS_IMG = "https://gateway.lighthouse.storage/ipfs/bafybeicizp4e7sh2lou53lyw2gtqsjf6rxcaf3epnkyejwnwjjd6w7mqou";

const RAFFLE_ABI = parseAbi([
  "function getActiveRaffles() view returns (uint256[])",
  "function getCompletedRaffles() view returns (uint256[])",
  "function getRaffleInfo(uint256 raffleId) view returns (address nftContract, uint256 tokenId, uint256 maxEntries, uint256 currentEntries, uint256 entryCost, bool isActive, bool isComplete, address winner)",
  "function hasUserEntered(uint256 raffleId, address user) view returns (bool)",
  "function enterRaffle(uint256 raffleId)",
]);

const SHACK_ABI = parseAbi(["function balanceOf(address account) view returns (uint256)"]);

// --- COMPONENT: RAFFLE CARD ---
function RaffleCard({ raffleId, onEnter, isPending, isConfirming, userAddress }: any) {
  const { data: info } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getRaffleInfo",
    args: [BigInt(raffleId)],
  });

  const { data: hasEntered } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "hasUserEntered",
    args: userAddress ? [BigInt(raffleId), userAddress as `0x${string}`] : undefined,
  });

  if (!info) return <div className="h-[500px] bg-white/5 animate-pulse rounded-[2rem]" />;

  const [nftContract, tokenId, maxEntries, currentEntries, entryCost, isActive, isComplete, winner] = info;
  const progress = maxEntries > 0n ? Number((currentEntries * 100n) / maxEntries) : 0;
  const entryCostFormatted = Math.floor(Number(formatEther(entryCost)));
  const imageUrl = `${IPFS_IMG}/${tokenId.toString()}.png`;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-[#0d0d12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative group"
    >
      <div className="h-72 relative overflow-hidden">
        <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent" />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/10">
          <span className="text-white font-bold text-xs">ID #{tokenId.toString()}</span>
        </div>
      </div>

      <div className="p-8 -mt-8 relative z-10">
        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">SHACKO #{tokenId.toString()}</h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-end">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Progress</span>
            <span className="text-white font-black">{progress}% Full</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Entry Price</p>
            <p className="text-white font-black text-lg">{entryCostFormatted} $SHACK</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Participants</p>
            <p className="text-white font-black text-lg">{currentEntries.toString()}/{maxEntries.toString()}</p>
          </div>
        </div>

        <button
          onClick={() => onEnter(raffleId)}
          disabled={isPending || isConfirming || !!hasEntered || !isActive}
          className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-cyan-400 transition-colors disabled:opacity-50 uppercase tracking-tighter"
        >
          {hasEntered ? "Already Entered" : "Enter Raffle"}
        </button>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE ---
export default function Raffle() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: activeRaffleIds, refetch: refetchActive } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getActiveRaffles",
  });

  const activeIds = (activeRaffleIds as bigint[] | undefined)?.map(Number) ?? [];

  useEffect(() => { if (isSuccess) setTimeout(() => refetchActive(), 2000); }, [isSuccess]);

  const handleEnterRaffle = (raffleId: number) => {
    if (!isConnected) { alert("Connect Wallet First"); return; }
    writeContract({ address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "enterRaffle", args: [BigInt(raffleId)] });
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-cyan-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6">
        {/* Simplified Premium Header */}
        <div className="mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-[120px] font-black leading-none mb-6 tracking-tighter italic uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Raffle</span> Vault
          </motion.h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            Stake your Shackos to earn $SHACK and win exclusive 1-of-1 assets from the treasury.
          </p>
        </div>

        {/* Raffles Grid - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {activeIds.map((id) => (
            <RaffleCard 
              key={id} 
              raffleId={id} 
              onEnter={handleEnterRaffle} 
              isPending={isPending} 
              isConfirming={isConfirming} 
              userAddress={address} 
            />
          ))}
        </div>

        {/* Status Toast */}
        <AnimatePresence>
          {(isConfirming || isSuccess) && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-10 right-10 bg-[#111114] border border-white/10 p-6 rounded-3xl shadow-2xl z-50 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500 animate-spin'}`}>
                {isSuccess ? <CheckCircle /> : <Zap />}
              </div>
              <div>
                <p className="font-black uppercase text-sm">{isSuccess ? "Success!" : "Processing..."}</p>
                <p className="text-xs text-gray-500">{isSuccess ? "Entry registered on-chain." : "Confirming your entry..."}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
