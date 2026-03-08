"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useAccount, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { formatEther } from "viem";
import { Ticket, Trophy, Users, Clock } from "lucide-react";

// Placeholder xSHACK token address - UPDATE AFTER DEPLOYMENT
const XSHACK_TOKEN_ADDRESS = "0xYourXShackTokenAddress";

export default function Raffle() {
  const { address, isConnected } = useAccount();

  // Get ETH balance on Base
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: base.id,
  });

  // Get xSHACK balance (placeholder for now)
  // TODO: Add actual xSHACK token balance read
  const xShackBalance = "0"; // Replace with actual balance read

  // Coming Soon raffle cards
  const comingSoonRaffles = [
    {
      id: 1,
      name: "Legendary Shacko Drop",
      image: "🦈👑",
      prize: "1x Legendary NFT",
      entryFee: "100 xSHACK",
      maxEntries: 100,
      status: "Coming Soon",
    },
    {
      id: 2,
      name: "Epic Shacko Bundle",
      image: "🦈💎",
      prize: "3x Epic NFTs",
      entryFee: "50 xSHACK",
      maxEntries: 200,
      status: "Coming Soon",
    },
    {
      id: 3,
      name: "xSHACK Jackpot",
      image: "🦈💰",
      prize: "10,000 xSHACK",
      entryFee: "25 xSHACK",
      maxEntries: 500,
      status: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc]">
      <Header />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-[Bangers] text-white text-stroke mb-4">
              SHACKO RAFFLES
            </h1>
            <p className="text-2xl font-bold text-slate-800">
              Use xSHACK to enter raffles and win epic prizes! 🎟️
            </p>
          </motion.div>

          {/* Wallet Balances */}
          {isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              {/* xSHACK Balance */}
              <div className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] border-4 border-black rounded-3xl p-6 comic-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-3xl">🦈</span>
                  </div>
                  <h3 className="text-2xl font-[Bangers] text-white">xSHACK Balance</h3>
                </div>
                <p className="text-5xl font-bold text-white">{xShackBalance}</p>
                <p className="text-sm text-white/80 mt-2">Stake NFTs to earn more xSHACK!</p>
              </div>

              {/* Base ETH Balance */}
              <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] border-4 border-black rounded-3xl p-6 comic-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-[Bangers] text-white">Base ETH</h3>
                </div>
                <p className="text-5xl font-bold text-white">
                  {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0.0000"}
                </p>
                <p className="text-sm text-white/80 mt-2">Used for transaction fees</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-4 border-black rounded-3xl p-8 text-center mb-12 comic-shadow"
            >
              <p className="text-2xl font-bold text-slate-700 mb-4">
                Connect your wallet to view balances and enter raffles!
              </p>
            </motion.div>
          )}

          {/* How to Participate */}
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] border-4 border-black rounded-3xl p-8 mb-12 comic-shadow">
            <h2 className="text-4xl font-[Bangers] text-white mb-8 text-center">
              How to Participate
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#0ea5e9] flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                  <Ticket size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">1. Earn xSHACK</h3>
                <p className="text-gray-300">Stake your SHACKO NFTs to earn xSHACK tokens</p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#ec4899] flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                  <Trophy size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">2. Choose Raffle</h3>
                <p className="text-gray-300">Browse active raffles and pick your prize</p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#fbbf24] flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                  <Users size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">3. Enter with xSHACK</h3>
                <p className="text-gray-300">Spend xSHACK to enter the raffle of your choice</p>
              </div>

              {/* Step 4 */}
              <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#10b981] flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                  <Clock size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">4. Wait for Draw</h3>
                <p className="text-gray-300">Winner is drawn randomly when raffle ends</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Raffles */}
          <div className="mb-12">
            <h2 className="text-5xl font-[Bangers] text-white text-center mb-8">
              Upcoming Raffles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {comingSoonRaffles.map((raffle, index) => (
                <motion.div
                  key={raffle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#2d1810] to-[#1a0f08] border-4 border-[#f59e0b] rounded-3xl overflow-hidden comic-shadow relative"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 left-4 bg-[#fbbf24] text-black px-4 py-2 rounded-xl font-bold text-sm border-2 border-black z-10">
                    {raffle.status}
                  </div>

                  {/* Prize Image */}
                  <div className="bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] h-64 flex items-center justify-center border-b-4 border-[#f59e0b]">
                    <span className="text-9xl">{raffle.image}</span>
                  </div>

                  {/* Raffle Details */}
                  <div className="p-6">
                    <h3 className="text-3xl font-[Bangers] text-[#fbbf24] mb-2">
                      {raffle.name}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-semibold">Prize:</span>
                        <span className="text-white font-bold">{raffle.prize}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-semibold">Entry Fee:</span>
                        <span className="text-[#fbbf24] font-bold">{raffle.entryFee}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-semibold">Max Entries:</span>
                        <span className="text-white font-bold">{raffle.maxEntries}</span>
                      </div>
                    </div>

                    {/* Coming Soon Button */}
                    <button
                      disabled
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-bold py-4 rounded-xl border-4 border-gray-800 cursor-not-allowed opacity-60"
                    >
                      COMING SOON
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-[#ec4899] to-[#f43f5e] border-4 border-black rounded-3xl p-8 text-center comic-shadow"
          >
            <h3 className="text-4xl font-[Bangers] text-white mb-4">
              Raffle System Launching Soon! 🎰
            </h3>
            <p className="text-xl text-white font-bold mb-4">
              Our custom raffle system is being built with provably fair draws using Chainlink VRF!
            </p>
            <p className="text-lg text-white/90">
              Start staking your NFTs now to accumulate xSHACK for upcoming raffles! 🦈
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
