"use client";

import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import MobileMenu from "@/components/MobileMenu"; // FIXED: default import
import { Footer } from "@/components/Footer";
import { Award } from "lucide-react";
import logoImage from "@assets/logo-shark.png";

const rarityTiers = [
  {
    name: "Common",
    badge: "🦈",
    color: "from-gray-400 to-gray-600",
    description: "Steady scraps",
    multiplier: "1.0x",
    dailyXP: "10 $ASS/day",
    perks: ["Baseline earnings", "Great for testing durations", "Consistent daily drip"],
  },
  {
    name: "Uncommon",
    badge: "🔵",
    color: "from-green-400 to-green-600",
    description: "Better bites",
    multiplier: "1.25x",
    dailyXP: "15 $ASS/day",
    perks: ["Slightly boosted multiplier", "Better long-duration value", "Balanced risk / reward"],
  },
  {
    name: "Rare",
    badge: "💙",
    color: "from-blue-400 to-blue-600",
    description: "Shiny salvage",
    multiplier: "1.5x",
    dailyXP: "20 $ASS/day",
    perks: ["Noticeable multiplier", "Strong mid-term compounding", "Great for 30-60 day runs"],
  },
  {
    name: "Epic",
    badge: "💜",
    color: "from-purple-400 to-purple-600",
    description: "Premium plunder",
    multiplier: "2.0x",
    dailyXP: "40 $ASS/day",
    perks: ["Significant boost", "Premium rewards", "Optimized for dedicated stakers"],
  },
  {
    name: "Legendary",
    badge: "👑",
    color: "from-yellow-400 to-orange-500",
    description: "Mythic treasure",
    multiplier: "3.0x",
    dailyXP: "80 $ASS/day",
    perks: ["Highest multiplier", "Premium daily rate", "Built for the long haul"],
  },
];

const durations = [
  { days: 7, label: "7 days", subtitle: "Fast test run", bonus: "1.0x" },
  { days: 14, label: "14 days", subtitle: "Solid baseline", bonus: "1.25x" },
  { days: 30, label: "30 days", subtitle: "Serious stack", bonus: "1.5x" },
  { days: 60, label: "60 days", subtitle: "Max commitment", bonus: "2.0x" },
];

export default function Rewards() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-x-hidden">
      <FloatingSharks />

      {/* Navbar with MobileMenu */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu /> {/* Hamburger on mobile */}
            <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-[Bangers] text-white">SHACKO</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-white hover:text-[#0ea5e9] transition-colors font-medium">
              Home
            </a>
            <a href="/about" className="text-white hover:text-[#0ea5e9] transition-colors font-medium">
              About
            </a>
            <a href="/staking" className="text-white hover:text-[#0ea5e9] transition-colors font-medium">
              Staking
            </a>
          </div>
        </div>
      </nav>

      {/* Hero / Intro */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-[#0ea5e9]/20 px-6 py-3 rounded-full mb-6"
          >
            <Award className="w-6 h-6 text-[#0ea5e9]" />
            <span className="text-lg font-bold text-[#0ea5e9] uppercase tracking-wider">Rewards</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-[Bangers] mb-6 text-white"
          >
            Earn <span className="text-[#0ea5e9]">$ASS</span> with intention
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Each NFT has a base daily rate. Rarity provides a boost — legendary sharks hit different. 
            Your Stakes page shows earned vs claimable live.
          </motion.p>
        </div>
      </section>

      {/* Rarity Tiers */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {rarityTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`bg-gradient-to-br ${tier.color} rounded-3xl p-8 border-2 border-white/20 shadow-xl hover:shadow-2xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl backdrop-blur-sm">
                    {tier.badge}
                  </div>
                  <div>
                    <h3 className="text-3xl font-[Bangers] text-white">{tier.name}</h3>
                    <p className="text-lg text-white/80">{tier.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{tier.multiplier}</div>
                  <div className="text-lg text-white/90">{tier.dailyXP}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {tier.perks.map((perk, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4 text-center text-white/90 backdrop-blur-sm">
                    {perk}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Duration Section */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-[Bangers] text-center text-white mb-10">
            Duration matters
          </h2>
          <p className="text-center text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Choose your lock-up time wisely — longer commitment = bigger rewards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {durations.map((duration, index) => (
              <motion.div
                key={duration.days}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-2xl p-6 border-2 border-[#0ea5e9]/30 text-center hover:scale-105 transition-transform"
              >
                <h3 className="text-3xl font-bold text-white mb-2">{duration.label}</h3>
                <p className="text-gray-300 mb-4">{duration.subtitle}</p>
                <div className="inline-block bg-[#0ea5e9]/20 px-4 py-2 rounded-full text-[#0ea5e9] font-bold">
                  {duration.bonus} bonus
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Example */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-3xl p-10 border-2 border-[#0ea5e9]/30">
            <h2 className="text-4xl font-[Bangers] text-center text-white mb-8">
              How $ASS Rewards Work
            </h2>

            <div className="bg-black/40 rounded-2xl p-8 font-mono text-lg space-y-6 border border-[#0ea5e9]/20">
              <div className="text-center text-gray-300">
                Total $ASS = (Base Rate × Rarity Multiplier × Days × Duration Bonus) / 100
              </div>

              <div className="border-t border-white/10 my-6"></div>

              <div className="text-[#0ea5e9] font-bold text-center text-xl">
                Example: Legendary NFT, 60 days, 2.0x bonus
              </div>

              <div className="text-white text-center text-2xl font-bold">
                = (80 $ASS/day × 3.0x × 60 days × 2.0) / 100
              </div>

              <div className="text-center">
                = <span className="text-[#38bdf8] text-4xl font-bold">28,800 $ASS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-3xl p-12 border-4 border-black comic-shadow"
          >
            <h2 className="text-5xl font-[Bangers] mb-6 text-white">
              Ready to Stack $ASS?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Connect your wallet and start earning today.
            </p>
            <a
              href="/staking"
              className="inline-block bg-white text-[#0ea5e9] px-10 py-5 rounded-xl font-[Bangers] text-2xl border-4 border-black hover:scale-105 transition-transform"
            >
              GO TO STAKING →
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}