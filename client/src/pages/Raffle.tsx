"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi, formatEther } from "viem";
import { Trophy, Users, Zap, Gift, Crown, X, ChevronRight, Ticket } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// ── CONTRACTS ─────────────────────────────────────────────────────────────
const SHACK_TOKEN_ADDRESS = "0x2FbCa943BbD81FCCeaedFAdbb324Bba51Fc6A2E3" as `0x${string}`;
const MULTI_RAFFLE_ADDRESS = "0xAC9fF7A959dEAe07080ABAA8850F01e7D06B5480" as `0x${string}`;
const IPFS_IMG = "https://gateway.lighthouse.storage/ipfs/bafybeicizp4e7sh2lou53lyw2gtqsjf6rxcaf3epnkyejwnwjjd6w7mqou";

// ── ABIs ──────────────────────────────────────────────────────────────────
const SHACK_ABI = parseAbi(["function balanceOf(address account) view returns (uint256)"]);
const RAFFLE_ABI = parseAbi([
  "function getActiveRaffles() view returns (uint256[])",
  "function getCompletedRaffles() view returns (uint256[])",
  "function getRaffleInfo(uint256 raffleId) view returns (address nftContract, uint256 tokenId, uint256 maxEntries, uint256 currentEntries, uint256 entryCost, bool isActive, bool isComplete, address winner)",
  "function hasUserEntered(uint256 raffleId, address user) view returns (bool)",
  "function enterRaffle(uint256 raffleId)",
]);

// ── RAFFLE DETAIL MODAL ───────────────────────────────────────────────────
function RaffleModal({ raffleId, onClose, onEnter, isPending, isConfirming, userAddress, shackBalance }: {
  raffleId: number;
  onClose: () => void;
  onEnter: (id: number) => void;
  isPending: boolean;
  isConfirming: boolean;
  userAddress: string | undefined;
  shackBalance: bigint | undefined;
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

  if (!info) return null;

  const [, tokenId, maxEntries, currentEntries, entryCost, isActive, isComplete, winner] = info;
  const progress = maxEntries > 0n ? Number((currentEntries * 100n) / maxEntries) : 0;
  const entryCostFormatted = Math.floor(Number(formatEther(entryCost)));
  const remaining = Number(maxEntries) - Number(currentEntries);
  const winChance = Number(currentEntries) > 0 ? (1 / (Number(currentEntries) + 1) * 100).toFixed(1) : "100.0";
  const canAfford = shackBalance ? shackBalance >= entryCost : false;
  const imageUrl = `${IPFS_IMG}/${tokenId.toString()}.png`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0d1525] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-white/5">
          {!imgError ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy size={48} className="text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1525] via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10">
            <X size={14} />
          </button>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/60 backdrop-blur-sm text-white/80 px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/10">Raffle #{raffleId}</span>
            {isComplete && <span className="bg-emerald-500/20 backdrop-blur-sm text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-500/30">✓ Complete</span>}
          </div>
          <div className="absolute bottom-3 left-4">
            <p className="text-white font-bold text-lg">SHACKO #{tokenId.toString()}</p>
          </div>
        </div>

        <div className="p-5">
          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { label: "Total", value: maxEntries.toString() },
              { label: "Entered", value: currentEntries.toString() },
              { label: "Win Chance", value: `${winChance}%` },
              { label: "Remaining", value: remaining.toString() },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Participants</span>
              <span className={progress === 100 ? "text-emerald-400" : "text-[#fbbf24]"}>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-emerald-400" : "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]"}`} style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Entry cost */}
          <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-[#fbbf24]" />
              <span className="text-sm text-gray-400">Entry Cost</span>
            </div>
            <span className="text-sm font-bold text-white">{entryCostFormatted} $SHACK</span>
          </div>

          {/* Winner section */}
          {isComplete && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Crown size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">Winner Selected</span>
              </div>
              <p className="text-sm font-bold text-white break-all">{winner.slice(0, 10)}...{winner.slice(-8)}</p>
            </div>
          )}

          {/* Enter button */}
          {!isComplete && (
            <>
              {!userAddress ? (
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              ) : !canAfford ? (
                <div className="w-full bg-white/5 border border-white/10 text-gray-500 font-semibold py-3 rounded-xl text-sm text-center">
                  Insufficient $SHACK Balance
                </div>
              ) : (
                <button
                  onClick={() => onEnter(raffleId)}
                  disabled={isPending || isConfirming || !!hasEntered || !isActive}
                  className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  {hasEntered ? "✓ Already Entered" : isPending || isConfirming ? "Entering..." : `Enter Raffle · ${entryCostFormatted} $SHACK`}
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── ACTIVE RAFFLE CARD ────────────────────────────────────────────────────
function ActiveRaffleCard({ raffleId, onClick, userAddress }: {
  raffleId: number;
  onClick: () => void;
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
    <div className="bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-white/5 rounded w-2/3" />
        <div className="h-3 bg-white/5 rounded w-full" />
        <div className="h-9 bg-white/5 rounded mt-2" />
      </div>
    </div>
  );

  const [, tokenId, maxEntries, currentEntries, entryCost] = info;
  const progress = maxEntries > 0n ? Number((currentEntries * 100n) / maxEntries) : 0;
  const entryCostFormatted = Math.floor(Number(formatEther(entryCost)));
  const imageUrl = `${IPFS_IMG}/${tokenId.toString()}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-[#0d1525] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden cursor-pointer transition-all group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {!imgError ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy size={40} className="text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Raffle number */}
        <div className="absolute top-2 left-2 bg-[#fbbf24] text-black px-2 py-0.5 rounded-md text-xs font-black">
          #{raffleId}
        </div>
        {hasEntered && (
          <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-sm">
            ✓ Entered
          </div>
        )}
        {/* Progress overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">{currentEntries.toString()}/{maxEntries.toString()} entries</span>
            <span className="text-[#fbbf24] font-semibold">{progress}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full">
            <div className="h-full bg-[#fbbf24] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="text-white font-bold text-sm mb-0.5">SHACKO #{tokenId.toString()}</p>
        <p className="text-xs text-gray-500 mb-3">{entryCostFormatted} $SHACK per entry</p>
        <button className="w-full flex items-center justify-center gap-1.5 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/20 text-[#fbbf24] font-semibold py-2 rounded-xl transition-colors text-sm">
          View Raffle <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ── COMPLETED RAFFLE CARD ─────────────────────────────────────────────────
function CompletedRaffleCard({ raffleId, onClick }: { raffleId: number; onClick: () => void }) {
  const { data: info } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getRaffleInfo",
    args: [BigInt(raffleId)],
  });
  const [imgError, setImgError] = useState(false);

  if (!info) return null;
  const [, tokenId, maxEntries, , entryCost, , , winner] = info;
  const entryCostFormatted = Math.floor(Number(formatEther(entryCost)));
  const imageUrl = `${IPFS_IMG}/${tokenId.toString()}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-[#0d1525] border border-white/5 hover:border-emerald-500/20 rounded-2xl overflow-hidden cursor-pointer transition-all group"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {!imgError ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy size={40} className="text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-sm">
          ✓ Complete
        </div>
        <div className="absolute top-2 right-2 bg-black/60 text-white/60 px-2 py-0.5 rounded-md text-xs backdrop-blur-sm">
          #{raffleId}
        </div>
      </div>
      <div className="p-4">
        <p className="text-white font-bold text-sm mb-1">SHACKO #{tokenId.toString()}</p>
        <div className="flex items-center gap-1.5 mb-3">
          <Crown size={11} className="text-emerald-400" />
          <p className="text-xs text-emerald-400 font-semibold">Winner: {winner.slice(0, 6)}...{winner.slice(-4)}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{maxEntries.toString()} entries</span>
          <span>{entryCostFormatted} $SHACK each</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function Raffle() {
  const { address, isConnected } = useAccount();
  const [selectedRaffle, setSelectedRaffle] = useState<number | null>(null);
  const [selectedCompleted, setSelectedCompleted] = useState<number | null>(null);

  const { data: shackBalance } = useReadContract({
    address: SHACK_TOKEN_ADDRESS, abi: SHACK_ABI, functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: activeRaffleIds, refetch: refetchActive } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getActiveRaffles",
  });
  const { data: completedRaffleIds } = useReadContract({
    address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "getCompletedRaffles",
  });

  const activeIds = (activeRaffleIds as bigint[] | undefined)?.map(Number) ?? [];
  const completedIds = (completedRaffleIds as bigint[] | undefined)?.map(Number) ?? [];

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) { setTimeout(() => refetchActive(), 2000); setSelectedRaffle(null); }
  }, [isSuccess]);

  const handleEnterRaffle = (raffleId: number) => {
    if (!isConnected) { alert("Please connect your wallet"); return; }
    writeContract({ address: MULTI_RAFFLE_ADDRESS, abi: RAFFLE_ABI, functionName: "enterRaffle", args: [BigInt(raffleId)] });
  };

  const shackFormatted = shackBalance ? Math.floor(Number(formatEther(shackBalance as bigint))).toLocaleString() : "0";

  return (
    <div className="min-h-screen bg-[#060b18] overflow-x-hidden">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">SHACKO Raffles</h1>
                <p className="text-gray-500 text-sm">Burn $SHACK to enter — winner picked automatically when full</p>
              </div>
              {/* $SHACK balance pill */}
              {isConnected && (
                <div className="flex items-center gap-2 bg-[#0d1525] border border-white/5 rounded-xl px-4 py-2.5">
                  <Zap size={14} className="text-[#fbbf24]" />
                  <span className="text-sm text-gray-400">Your Balance</span>
                  <span className="text-sm font-bold text-white">{shackFormatted} $SHACK</span>
                </div>
              )}
            </div>
          </div>

          {/* Connect prompt */}
          {!isConnected && (
            <div className="bg-[#0d1525] border border-[#fbbf24]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">Connect your wallet</p>
                <p className="text-gray-500 text-xs">Connect to view your $SHACK balance and enter raffles</p>
              </div>
              <ConnectButton />
            </div>
          )}

          {/* How it works */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { icon: Ticket,   label: "Earn $SHACK",     desc: "Stake NFTs to earn",         color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
              { icon: Trophy,   label: "Choose Raffle",   desc: "Pick your prize",             color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20" },
              { icon: Users,    label: "Burn to Enter",   desc: "1 entry per wallet",          color: "text-[#fbbf24]",   bg: "bg-[#fbbf24]/10",   border: "border-[#fbbf24]/20" },
              { icon: Zap,      label: "Auto Draw",       desc: "Instant winner when full",    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            ].map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`${bg} border ${border} rounded-2xl p-4 flex flex-col gap-2`}>
                <Icon size={18} className={color} />
                <p className={`text-sm font-semibold ${color}`}>{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* Active Raffles */}
          {activeIds.length > 0 ? (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  Active Raffles ({activeIds.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeIds.map((id) => (
                  <ActiveRaffleCard
                    key={id} raffleId={id}
                    onClick={() => setSelectedRaffle(id)}
                    userAddress={address}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-16 text-center mb-12">
              <Gift size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No active raffles right now</p>
              <p className="text-gray-600 text-sm mt-1">New raffles coming soon — keep staking to earn $SHACK!</p>
            </div>
          )}

          {/* Past Winners */}
          {completedIds.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
                Past Winners ({completedIds.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {completedIds.map((id) => (
                  <CompletedRaffleCard key={id} raffleId={id} onClick={() => setSelectedCompleted(id)} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Active Raffle Modal */}
      <AnimatePresence>
        {selectedRaffle !== null && (
          <RaffleModal
            raffleId={selectedRaffle}
            onClose={() => setSelectedRaffle(null)}
            onEnter={handleEnterRaffle}
            isPending={isPending}
            isConfirming={isConfirming}
            userAddress={address}
            shackBalance={shackBalance as bigint | undefined}
          />
        )}
      </AnimatePresence>

      {/* Completed Raffle Modal */}
      <AnimatePresence>
        {selectedCompleted !== null && (
          <RaffleModal
            raffleId={selectedCompleted}
            onClose={() => setSelectedCompleted(null)}
            onEnter={handleEnterRaffle}
            isPending={isPending}
            isConfirming={isConfirming}
            userAddress={address}
            shackBalance={shackBalance as bigint | undefined}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-[#0d1525] border border-[#fbbf24]/30 rounded-2xl px-5 py-4 shadow-2xl z-50 flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse" />
            <p className="text-white text-sm font-medium">Confirming entry...</p>
          </motion.div>
        )}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-4 shadow-2xl z-50 flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <p className="text-emerald-400 text-sm font-medium">✅ Entry successful!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
