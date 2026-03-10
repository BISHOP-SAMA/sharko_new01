"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Award, ArrowRight, TrendingUp, Clock, Zap } from "lucide-react";

const rarityTiers = [
  {
    name: "Common",
    badge: "🦈",
    color: "from-gray-400 to-gray-600",
    description: "Steady scraps",
    multiplier: "1.0x",
    dailyXP: "10 xSHACK/day",
    perks: ["Baseline earnings", "Great for testing durations", "Consistent daily drip"],
  },
  {
    name: "Uncommon",
    badge: "🔵",
    color: "from-green-400 to-green-600",
    description: "Better bites",
    multiplier: "1.25x",
    dailyXP: "15 xSHACK/day",
    perks: ["Slightly boosted multiplier", "Better long-duration value", "Balanced risk / reward"],
  },
  {
    name: "Rare",
    badge: "💙",
    color: "from-blue-400 to-blue-600",
    description: "Shiny salvage",
    multiplier: "1.5x",
    dailyXP: "20 xSHACK/day",
    perks: ["Noticeable multiplier", "Strong mid-term compounding", "Great for 30-60 day runs"],
  },
  {
    name: "Epic",
    badge: "💜",
    color: "from-purple-400 to-purple-600",
    description: "Premium plunder",
    multiplier: "2.0x",
    dailyXP: "40 xSHACK/day",
    perks: ["Significant boost", "Premium rewards", "Optimized for dedicated stakers"],
  },
  {
    name: "Legendary",
    badge: "👑",
    color: "from-yellow-400 to-orange-500",
    description: "Mythic treasure",
    multiplier: "3.0x",
    dailyXP: "80 xSHACK/day",
    perks: ["Highest multiplier", "Premium daily rate", "Built for the long haul"],
  },
];

const durations = [
  { days: 7, label: "7 days", subtitle: "Fast test run", bonus: "1.0x", icon: Zap },
  { days: 14, label: "14 days", subtitle: "Solid baseline", bonus: "1.25x", icon: TrendingUp },
  { days: 30, label: "30 days", subtitle: "Serious stack", bonus: "1.5x", icon: Award },
  { days: 60, label: "60 days", subtitle: "Max commitment", bonus: "2.0x", icon: Clock },
];

export default function Rewards() {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 backdrop-blur-sm px-8 py-4 rounded-full mb-8 border-2 border-[#fbbf24]/30"
          >
            <Award className="w-8 h-8 text-[#fbbf24]" />
            <span className="text-2xl font-black text-[#fbbf24]" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
              REWARDS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[15vw] md:text-[140px] font-black leading-none mb-8"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              background: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EARN xSHACK
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-semibold"
          >
            Each NFT has a base daily rate. Rarity provides a boost — legendary sharks hit different. 
            Your Stakes page shows earned vs claimable live.
          </motion.p>
        </div>
      </section>

      {/* Rarity Tiers */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-6xl md:text-8xl font-black text-white text-center mb-16"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            RARITY TIERS
          </h2>

          <div className="space-y-6">
            {rarityTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`bg-gradient-to-br ${tier.color} rounded-3xl p-8 border-4 border-black shadow-2xl hover:scale-[1.02] transition-transform`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center text-5xl">
                      {tier.badge}
                    </div>
                    <div>
                      <h3
                        className="text-4xl font-black text-white mb-1"
                        style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                      >
                        {tier.name}
                      </h3>
                      <p className="text-xl text-white/90 font-semibold">{tier.description}</p>
                    </div>
                  </div>
                  <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                    <div className="text-4xl font-black text-white mb-1">{tier.multiplier}</div>
                    <div className="text-xl text-white/90 font-bold">{tier.dailyXP}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tier.perks.map((perk, i) => (
                    <div
                      key={i}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white font-semibold border-2 border-white/20"
                    >
                      {perk}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Duration Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2d1b4e] to-[#0a0e27]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-6xl md:text-8xl font-black text-center text-white mb-8"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            DURATION MATTERS
          </h2>
          <p className="text-center text-2xl text-gray-300 mb-16 max-w-3xl mx-auto font-semibold">
            Choose your lock-up time wisely — longer commitment = bigger rewards
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {durations.map((duration, index) => {
              const Icon = duration.icon;
              return (
                <motion.div
                  key={duration.days}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] rounded-3xl p-8 border-4 border-black text-center hover:scale-105 transition-transform shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-full bg-[#00d9ff]/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border-2 border-[#00d9ff]/40">
                    <Icon size={32} className="text-[#00d9ff]" />
                  </div>
                  <h3
                    className="text-4xl font-black text-white mb-2"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    {duration.label}
                  </h3>
                  <p className="text-gray-400 mb-6 font-semibold">{duration.subtitle}</p>
                  <div className="inline-block bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] px-6 py-3 rounded-full text-black font-black text-lg border-2 border-black">
                    {duration.bonus} bonus
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculation Example */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] rounded-3xl p-12 border-4 border-black shadow-2xl">
            <h2
              className="text-5xl md:text-7xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] mb-12"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              HOW xSHACK REWARDS WORK
            </h2>

            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-10 border-2 border-[#fbbf24]/30 space-y-8">
              <div className="text-center text-gray-300 text-xl font-mono">
                Total xSHACK = (Base Rate × Rarity Multiplier × Days × Duration Bonus) / 100
              </div>

              <div className="border-t border-white/20 my-8"></div>

              <div className="text-[#fbbf24] font-black text-center text-2xl mb-6">
                EXAMPLE: Legendary NFT, 60 days, 2.0x bonus
              </div>

              <div className="text-white text-center text-3xl font-bold mb-8">
                = (80 xSHACK/day × 3.0x × 60 days × 2.0) / 100
              </div>

              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-3xl p-8 border-4 border-black">
                  <span className="text-6xl font-black text-white">28,800</span>
                  <span className="text-3xl font-black text-white ml-3">xSHACK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] blur-3xl opacity-30 rounded-3xl" />

            <div className="relative bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-3xl p-16 border-4 border-black shadow-2xl text-center">
              <h2
                className="text-6xl md:text-8xl font-black text-black mb-6"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                READY TO EARN? 
              </h2>
              
              <p className="text-2xl md:text-3xl text-black/90 font-bold mb-12 max-w-2xl mx-auto">
                Connect your wallet and start stacking xSHACK rewards today
              </p>

              <a href="/staking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-4 mx-auto bg-black text-white px-12 py-6 rounded-full font-black text-2xl border-4 border-white shadow-lg hover:shadow-2xl transition-all"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  <span>GO TO STAKING</span>
                  <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </a>

              <p className="mt-8 text-black/80 font-bold text-lg">
                Start earning rewards in minutes ⚡
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
