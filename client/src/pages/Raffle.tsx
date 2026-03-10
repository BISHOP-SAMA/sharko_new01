"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useAccount, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { formatEther } from "viem";
import { Ticket, Trophy, Users, Clock, Sparkles, Zap, Gift } from "lucide-react";

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
  const xShackBalance = "0";

  const comingSoonRaffles = [
    {
      id: 1,
      name: "Legendary Shacko Drop",
      icon: Trophy,
      prize: "1x Legendary NFT",
      entryFee: "100 xSHACK",
      maxEntries: 100,
      status: "Coming Soon",
      gradient: "from-[#fbbf24] to-[#f59e0b]",
    },
    {
      id: 2,
      name: "Epic Shacko Bundle",
      icon: Sparkles,
      prize: "3x Epic NFTs",
      entryFee: "50 xSHACK",
      maxEntries: 200,
      status: "Coming Soon",
      gradient: "from-[#8b5cf6] to-[#7c3aed]",
    },
    {
      id: 3,
      name: "xSHACK Jackpot",
      icon: Gift,
      prize: "10,000 xSHACK",
      entryFee: "25 xSHACK",
      maxEntries: 500,
      status: "Coming Soon",
      gradient: "from-[#10b981] to-[#14b8a6]",
    },
  ];

  const steps = [
    {
      icon: Ticket,
      title: "Earn xSHACK",
      description: "Stake your SHACKO NFTs to earn xSHACK tokens",
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
      title: "Enter with xSHACK",
      description: "Use xSHACK to enter the raffle",
      color: "from-[#fbbf24] to-[#f59e0b]",
    },
    {
      icon: Clock,
      title: "Wait for Draw",
      description: "Winner drawn randomly when raffle ends",
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
              Use xSHACK to enter raffles and win exclusive prizes
            </p>
          </motion.div>

          {/* Wallet Balances */}
          {isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
            >
              {/* xSHACK Balance */}
              <div className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] border-4 border-black rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                    <Zap size={32} className="text-white" />
                  </div>
                  <h3
                    className="text-3xl font-black text-white"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    xSHACK Balance
                  </h3>
                </div>
                <p className="text-6xl font-black text-white mb-2">{xShackBalance}</p>
                <p className="text-lg text-white/90 font-semibold">Stake NFTs to earn more xSHACK</p>
              </div>

              {/* Base ETH Balance */}
              <div className="bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] border-4 border-black rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <h3
                    className="text-3xl font-black text-white"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    Base ETH
                  </h3>
                </div>
                <p className="text-6xl font-black text-white mb-2">
                  {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0.0000"}
                </p>
                <p className="text-lg text-white/90 font-semibold">Used for transaction fees</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-[#00d9ff]/30 rounded-3xl p-10 text-center mb-16"
            >
              <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                Connect your wallet to view balances and enter raffles
              </p>
              <p className="text-lg text-gray-400">
                You'll need xSHACK tokens to participate in raffles
              </p>
            </motion.div>
          )}

          {/* How to Participate */}
          <div className="bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e] border-4 border-black rounded-3xl p-10 mb-16 shadow-2xl">
            <h2
              className="text-6xl md:text-8xl font-black text-white mb-12 text-center"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              How to Participate
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

          {/* Coming Soon Raffles */}
          <div className="mb-16">
            <h2
              className="text-6xl md:text-8xl font-black text-white text-center mb-12"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              Upcoming Raffles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {comingSoonRaffles.map((raffle, index) => {
                const Icon = raffle.icon;
                return (
                  <motion.div
                    key={raffle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${raffle.gradient} border-4 border-black rounded-3xl overflow-hidden shadow-2xl relative`}
                  >
                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-5 py-2 rounded-full font-black text-sm uppercase tracking-wider border-2 border-white/30 z-10">
                      {raffle.status}
                    </div>

                    {/* Icon Display */}
                    <div className="h-64 flex items-center justify-center bg-white/10 backdrop-blur-sm border-b-4 border-black">
                      <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center">
                        <Icon size={64} className="text-white" />
                      </div>
                    </div>

                    {/* Raffle Details */}
                    <div className="p-8">
                      <h3
                        className="text-4xl font-black text-white mb-6"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        {raffle.name}
                      </h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
                          <span className="text-white/80 font-bold">Prize</span>
                          <span className="text-white font-black">{raffle.prize}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
                          <span className="text-white/80 font-bold">Entry Fee</span>
                          <span className="text-white font-black">{raffle.entryFee}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
                          <span className="text-white/80 font-bold">Max Entries</span>
                          <span className="text-white font-black">{raffle.maxEntries}</span>
                        </div>
                      </div>

                      {/* Coming Soon Button */}
                      <button
                        disabled
                        className="w-full bg-black/60 backdrop-blur-sm text-white/60 font-black py-5 rounded-xl border-4 border-white/20 cursor-not-allowed text-xl"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        COMING SOON
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#ec4899] to-[#f97316] border-4 border-black rounded-3xl p-10 text-center shadow-2xl"
          >
            <h3
              className="text-5xl md:text-7xl font-black text-white mb-6"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              Raffle System Launching Soon
            </h3>
            <p className="text-xl md:text-2xl text-white font-bold mb-4 max-w-3xl mx-auto">
              Our custom raffle system is being built with provably fair draws using Chainlink VRF
            </p>
            <p className="text-lg text-white/90 font-semibold max-w-2xl mx-auto">
              Start staking your NFTs now to accumulate xSHACK for upcoming raffles
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
