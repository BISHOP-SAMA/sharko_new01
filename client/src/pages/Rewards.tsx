import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import { MobileMenu } from "@/components/MobileMenu";
import { Footer } from "@/components/Footer";
import { Award } from "lucide-react";
import logoImage from "@assets/logo-shark.png";

export default function Rewards() {
  const rarityTiers = [
    {
      name: "Common",
      badge: "🦈",
      color: "from-gray-400 to-gray-600",
      description: "Steady scraps",
      multiplier: "1.0x",
      dailyXP: "10 $ASS/day",
      perks: [
        "Baseline earnings",
        "Great for testing durations",
        "Consistent daily drip"
      ]
    },
    {
      name: "Uncommon",
      badge: "🔵",
      color: "from-green-400 to-green-600",
      description: "Better bites",
      multiplier: "1.25x",
      dailyXP: "15 $ASS/day",
      perks: [
        "Slightly boosted multiplier",
        "Better long-duration value",
        "Balanced risk / reward"
      ]
    },
    {
      name: "Rare",
      badge: "💙",
      color: "from-blue-400 to-blue-600",
      description: "Shiny salvage",
      multiplier: "1.5x",
      dailyXP: "20 $ASS/day",
      perks: [
        "Noticeable multiplier",
        "Strong mid-term compounding",
        "Great for 30-60 day runs"
      ]
    },
    {
      name: "Epic",
      badge: "💜",
      color: "from-purple-400 to-purple-600",
      description: "Premium plunder",
      multiplier: "2.0x",
      dailyXP: "40 $ASS/day",
      perks: [
        "Significant boost",
        "Premium rewards",
        "Optimized for dedicated stakers"
      ]
    },
    {
      name: "Legendary",
      badge: "👑",
      color: "from-yellow-400 to-orange-500",
      description: "Mythic treasure",
      multiplier: "3.0x",
      dailyXP: "80 $ASS/day",
      perks: [
        "Highest multiplier",
        "Premium daily rate",
        "Built for the long haul"
      ]
    }
  ];

  const durations = [
    { days: 7, label: "7 days", subtitle: "Fast test run", bonus: "1.0x" },
    { days: 14, label: "14 days", subtitle: "Solid baseline", bonus: "1.25x" },
    { days: 30, label: "30 days", subtitle: "Serious stack", bonus: "1.5x" },
    { days: 60, label: "60 days", subtitle: "Max commitment", bonus: "2.0x" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <img src={logoImage} alt="Shacko" className="w-12 h-12" />
            <span className="text-2xl font-[Bangers] text-white">SHACKO</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-3xl p-8 border-2 border-[#0ea5e9]/30"
          >
            <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/20 px-4 py-2 rounded-full mb-6">
              <Award className="w-5 h-5 text-[#0ea5e9]" />
              <span className="text-sm font-bold text-[#0ea5e9] uppercase">Rewards & Rarity</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-[Bangers] mb-6 text-white">
              Earn <span className="text-[#0ea5e9]">$ASS</span> with intention
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed">
              Each NFT has a base daily rate. Rarity provides a boost — legendary sharks hit different. 
              Your Stakes page shows earned vs claimable live.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rarity Tiers */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {rarityTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-2xl p-6 border-2 border-[#0ea5e9]/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${tier.color} flex items-center justify-center text-3xl border-2 border-white/20`}>
                    {tier.badge}
                  </div>
                  <div>
                    <div className="text-xs text-[#0ea5e9] uppercase tracking-wider mb-1 font-bold">Tier</div>
                    <h3 className="text-2xl font-bold mb-1 text-white">{tier.name}</h3>
                    <p className="text-gray-200">{tier.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#0ea5e9] uppercase mb-1 font-bold">Multiplier</div>
                  <div className="text-2xl font-bold text-white">{tier.multiplier}</div>
                  <div className="text-sm text-gray-200 mt-1">{tier.dailyXP}</div>
                </div>
              </div>

              <div className="space-y-2">
                {tier.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-3 text-gray-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] mt-2" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Duration Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-[Bangers] mb-3 text-white">Duration matters</h2>
            <p className="text-gray-200 text-lg">
              Choose 7 / 14 / 30 / 60 days — longer duration generally means a more serious grind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {durations.map((duration, index) => (
              <motion.div
                key={duration.days}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-xl p-6 border-2 border-[#0ea5e9]/30"
              >
                <h3 className="text-3xl font-bold mb-2 text-white">{duration.label}</h3>
                <p className="text-gray-200 mb-3">{duration.subtitle}</p>
                <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/20 px-3 py-1 rounded-full">
                  <span className="text-[#0ea5e9] font-bold text-sm">{duration.bonus} bonus</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Example */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-2xl p-8 border-2 border-[#0ea5e9]/30">
            <div className="text-center mb-6">
              <div className="text-5xl font-[Bangers] mb-2">
                <span className="text-white">$ASS</span> <span className="text-[#0ea5e9]">REWARDS</span>
              </div>
              <div className="text-gray-200">How your rewards are calculated</div>
            </div>

            <div className="bg-[#0f172a]/50 rounded-xl p-6 font-mono text-sm space-y-3 border border-[#0ea5e9]/20">
              <div className="text-gray-200">
                Total $ASS = (Base Rate × Rarity Multiplier × Days × Duration Bonus) / 100
              </div>
              <div className="border-t border-white/10 my-4"></div>
              <div className="text-[#0ea5e9] font-bold">Example: Legendary NFT, 60 days, 2.0x bonus</div>
              <div className="text-white">= (80 $ASS/day × 3.0x × 60 days × 200) / 100</div>
              <div className="text-white">
                = <span className="text-[#38bdf8] font-bold text-3xl">28,800 $ASS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-2xl p-12 border-4 border-black"
          >
            <h2 className="text-4xl font-[Bangers] mb-4 text-white">Ready to Stack $ASS?</h2>
            <p className="text-lg mb-6 text-white/90">
              Connect your wallet and start earning today.
            </p>
            <button className="bg-white text-[#0ea5e9] px-8 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform">
              GO TO STAKING →
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
            }
