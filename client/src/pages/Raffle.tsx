"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi, formatEther } from "viem";
import { Ticket, Trophy, Users, Clock, Zap, Gift, CheckCircle } from "lucide-react";

// ── MAINNET CONTRACT ADDRESSES ─────────────────────────────────────────────
const SHACK_TOKEN_ADDRESS = "0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3" as `0x${string}`;
const MULTI_RAFFLE_ADDRESS = "0xAC9fF7A959dEAe07080ABAA8850F01e7D06B5480" as `0x${string}`;
const SHACKO_NFT = "0x7f30f4b6d5C98D29E32cf013558A01443c87C013";
const IPFS_IMG = "https://gateway.lighthouse.storage/ipfs/bafybeicizp4e7sh2lou53lyw2gtqsjf6rxcaf3epnkyejwnwjjd6w7mqou";

// ── ABIs ───────────────────────────────────────────────────────────────────
const SHACK_ABI = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
]);

const RAFFLE_ABI = parseAbi([
  "function getActiveRaffles() view returns (uint256[])",
  "function getCompletedRaffles() view returns (uint256[])",
  "function getRaffleInfo(uint256 raffleId) view returns (address nftContract, uint256 tokenId, uint256 maxEntries, uint256 currentEntries, uint256 entryCost, bool isActive, bool isComplete, address winner)",
  "function hasUserEntered(uint256 raffleId, address user) view returns (bool)",
  "function enterRaffle(uint256 raffleId)",
]);

interface RaffleData {
  id: number;
  nftContract: string;
  tokenId: bigint;
  maxEntries: bigint;
  currentEntries: bigint;
  entryCost: bigint;
  isActive: boolean;
  isComplete: boolean;
  winner: string;
}

// ── RAFFLE CARD — reads live data per raffle ───────────────────────────────
function RaffleCard({ raffleId, onEnter, isPending, isConfirming, userAddress }: {
  raffleId: number;
  onEnter: (id: number) => void;
  isPending: boolean;
  isConfirming: boolean;
  userAddress: string | undefined;
}) {
  const { data: info } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getRaffleInfo",
    args: [BigInt(raffleId)],
  });
  const { data: hasEntered } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "hasUserEntered",
    args: userAddress ? [BigInt(raffleId), userAddress as `0x${string}`] : undefined,
    query: { enabled: !!userAddress },
  });

  const [imgError, setImgError] = useState(false);

  if (!info) return (
    <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] border-4 border-black rounded-3xl overflow-hidden shadow-2xl animate-pulse">
      <div className="h-64 bg-white/10" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-white/20 rounded w-1/2" />
        <div className="h-4 bg-white/20 rounded w-full" />
        <div className="h-12 bg-white/20 rounded" />
      </div>
    </div>
  );

  const [nftContract, tokenId, maxEntries, currentEntries, entryCost, isActive, isComplete, winner] = info;
  const progress = maxEntries > 0n ? Number((currentEntries * 100n) / maxEntries) : 0;
  const entryCostFormatted = Math.floor(Number(formatEther(entryCost)));
  const imageUrl = `${IPFS_IMG}/${tokenId.toString()}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] border-4 border-black rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="h-64 bg-gradient-to-br from-white/10 to-white/5 border-b-4 border-black overflow-hidden relative">
        {!imgError ? (
          <img src={imageUrl} alt={`SHACKO #${tokenId}`} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Trophy size={64} className="text-white mx-auto mb-4" />
              <p className="text-white font-black text-2xl">SHACKO #{tokenId.toString()}</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
          #{raffleId}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
          SHACKO #{tokenId.toString()}
        </h3>

        <div className="mb-5">
          <div className="flex justify-between text-white font-bold mb-2">
            <span>Entries</span>
            <span>{currentEntries.toString()}/{maxEntries.toString()}</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-5 border-2 border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-white/80 text-sm mt-1 font-semibold text-right">{progress}% Full</p>
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex justify-between items-center bg-white/10 rounded-xl p-3 border-2 border-white/20">
            <span className="text-white/80 font-bold">Entry Cost</span>
            <span className="text-white font-black">{entryCostFormatted} $SHACK</span>
          </div>
          <div className="flex justify-between items-center bg-white/10 rounded-xl p-3 border-2 border-white/20">
            <span className="text-white/80 font-bold">Your Status</span>
            <span className={`font-black ${hasEntered ? "text-emerald-300" : "text-white"}`}>
              {hasEntered ? "✓ Entered" : "Not Entered"}
            </span>
          </div>
        </div>

        <button
          onClick={() => onEnter(raffleId)}
          disabled={isPending || isConfirming || !!hasEntered || !isActive}
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black font-black py-4 rounded-xl border-4 border-black hover:opacity-90 transition-opacity disabled:opacity-50 text-xl"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          {hasEntered ? "ALREADY ENTERED" : isPending || isConfirming ? "ENTERING..." : `ENTER (${entryCostFormatted} $SHACK)`}
        </button>
      </div>
    </motion.div>
  );
}

// ── COMPLETED RAFFLE CARD ──────────────────────────────────────────────────
function CompletedRaffleCard({ raffleId }: { raffleId: number }) {
  const { data: info } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getRaffleInfo",
    args: [BigInt(raffleId)],
  });
  const [imgError, setImgError] = useState(false);

  if (!info) return null;
  const [, tokenId, maxEntries, , , , , winner] = info;
  const imageUrl = `${IPFS_IMG}/${tokenId.toString()}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-gradient-to-br from-[#10b981] to-[#14b8a6] border-4 border-black rounded-3xl overflow-hidden shadow-2xl relative"
    >
      <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider border-2 border-white/30 z-10">
        ✓ Complete
      </div>
      <div className="h-48 border-b-4 border-black overflow-hidden">
        {!imgError ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/10">
            <CheckCircle size={64} className="text-white" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
          SHACKO #{tokenId.toString()}
        </h3>
        <div className="bg-white/10 rounded-xl p-4 border-2 border-white/20 mb-3">
          <p className="text-white/80 font-bold text-sm mb-1">Winner</p>
          <p className="text-white font-black text-lg break-all">{winner.slice(0, 6)}...{winner.slice(-4)}</p>
        </div>
        <div className="flex justify-between text-white font-bold">
          <span>Total Entries:</span>
          <span>{maxEntries.toString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Raffle() {
  const { address, isConnected } = useAccount();

  // Read $SHACK balance
  const { data: shackBalance } = useReadContract({
    address: SHACK_TOKEN_ADDRESS, abi: SHACK_ABI, functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Read active & completed raffle IDs from contract
  const { data: activeRaffleIds, refetch: refetchActive } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getActiveRaffles",
  });

  const { data: completedRaffleIds } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getCompletedRaffles",
  });

  const activeIds = (activeRaffleIds as bigint[] | undefined)?.map(Number) ?? [];
  const completedIds = (completedRaffleIds as bigint[] | undefined)?.map(Number) ?? [];

  // Write
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) setTimeout(() => refetchActive(), 2000);
  }, [isSuccess]);

  const handleEnterRaffle = (raffleId: number) => {
    if (!isConnected) { alert("Please connect your wallet"); return; }
    writeContract({ address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "enterRaffle", args: [BigInt(raffleId)] });
  };

  const formatShack = (balance: bigint | undefined) => {
    if (!balance) return "0";
    return Math.floor(Number(balance) / 1e18).toLocaleString();
  };

  const getProgressPercentage = (current: bigint, max: bigint) => {
    if (max === BigInt(0)) return 0;
    return Number((current * BigInt(100)) / max);
  };

  const steps = [
    {
      icon: Ticket,
      title: "Earn $SHACK",
      description: "Stake your SHACKO NFTs to earn $SHACK tokens",
      color: "from-[#0ea5e9] to-[#38bdf8]",
    },
    {
      icon: Trophy,
      title: "Choose Raffle",
      description: "Browse active raffles and select your prize",
      color: "from-[#ec4899] to-[#f97316]",
    },
    {
      icon: Users,
      title: "Enter with $SHACK",
      description: "Burn 100 $SHACK to enter (1 entry per raffle)",
      color: "from-[#fbbf24] to-[#f59e0b]",
    },
    {
      icon: Zap,
      title: "Auto Draw",
      description: "Winner picked automatically when raffle fills up!",
      color: "from-[#10b981] to-[#14b8a6]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Header />

      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1
              className="text-[15vw] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] leading-none mb-8"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                WebkitTextStroke: "2px rgba(139, 92, 246, 0.3)",
              }}
            >
              SHACKO RAFFLES
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 font-bold max-w-3xl mx-auto">
              Enter raffles with $SHACK and win exclusive NFTs!
            </p>
          </motion.div>

          {/* $SHACK Balance */}
          {isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] border-4 border-black rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                    <Zap size={32} className="text-white" />
                  </div>
                  <h3
                    className="text-3xl font-black text-white"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    Your $SHACK Balance
                  </h3>
                </div>
                <p className="text-6xl font-black text-white mb-2">{formatShack(shackBalance as bigint)}</p>
                <p className="text-lg text-white/90 font-semibold">Each entry costs 100 $SHACK</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-[#00d9ff]/30 rounded-3xl p-10 text-center mb-16"
            >
              <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                Connect your wallet to view raffles and enter
              </p>
              <p className="text-lg text-gray-400">
                You'll need $SHACK tokens to participate in raffles
              </p>
            </motion.div>
          )}

          {/* How to Participate */}
          <div className="bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e] border-4 border-black rounded-3xl p-10 mb-16 shadow-2xl">
            <h2
              className="text-6xl md:text-8xl font-black text-white mb-12 text-center"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${step.color} rounded-2xl p-6 border-4 border-black text-center shadow-xl`}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mx-auto mb-4">
                      <Icon size={32} className="text-white" />
                    </div>
                    <div
                      className="text-5xl font-black text-white mb-2"
                      style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                    >
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">{step.title}</h3>
                    <p className="text-white/90 font-semibold">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Active Raffles */}
          {activeIds.length > 0 ? (
            <div className="mb-16">
              <h2
                className="text-6xl md:text-8xl font-black text-white text-center mb-12"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                Active Raffles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </div>
          ) : (
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#ec4899] to-[#f97316] border-4 border-black rounded-3xl p-10 text-center shadow-2xl"
              >
                <Gift size={80} className="text-white mx-auto mb-6" />
                <h3
                  className="text-5xl md:text-7xl font-black text-white mb-6"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  No Active Raffles
                </h3>
                <p className="text-xl md:text-2xl text-white font-bold mb-4 max-w-3xl mx-auto">
                  New raffles coming soon! Start staking to earn $SHACK.
                </p>
              </motion.div>
            </div>
          )}

          {/* Completed Raffles */}
          {completedIds.length > 0 && (
            <div className="mb-16">
              <h2
                className="text-6xl md:text-8xl font-black text-white text-center mb-12"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                Past Winners
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedIds.map((id) => (
                  <CompletedRaffleCard key={id} raffleId={id} />
                ))}
              </div>
            </div>
          )}

          {/* Transaction Status */}
          {isConfirming && (
            <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] border-4 border-black rounded-2xl p-6 shadow-2xl z-50">
              <p className="text-black font-black text-lg">
                ⏳ Confirming transaction...
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#10b981] to-[#14b8a6] border-4 border-black rounded-2xl p-6 shadow-2xl z-50">
              <p className="text-white font-black text-lg">
                ✅ Entry successful!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
