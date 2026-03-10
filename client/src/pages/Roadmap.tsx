"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, Circle, Sparkles, Rocket, Film, Coins, Store } from "lucide-react";

const phases = [
  {
    phase: "I",
    title: "Foundation",
    status: "active",
    color: "from-[#0ea5e9] to-[#38bdf8]",
    icon: Sparkles,
    items: [
      "Launch of the Shacko Genesis Collection (888 Supply)",
      "Community formation and OG network expansion",
      "Development and launch of the Shacko Platform",
      "Introduction of the Shacko universe through lore and storytelling",
      "Early ecosystem features and platform architecture",
    ],
    description:
      "This phase lays the foundation for the Shacko ecosystem and introduces the first members of the Shacko syndicate.",
  },
  {
    phase: "II",
    title: "Ecosystem Expansion",
    status: "upcoming",
    color: "from-[#fbbf24] to-[#f59e0b]",
    icon: Rocket,
    items: [
      "Launch of Shacko Arcade",
      "Release of Shacko Pump",
      "Introduction of staking mechanics for Shacko holders",
      "Implementation of the Shacko Rewards system",
      "Expansion of community engagement initiatives",
    ],
    description:
      "During this phase, Shacko evolves from a digital collectible into a functional ecosystem with real platform interaction.",
  },
  {
    phase: "III",
    title: "Story & World Building",
    status: "upcoming",
    color: "from-[#ec4899] to-[#f43f5e]",
    icon: Film,
    items: [
      "Launch of the Shacko Theatre",
      "Animated storytelling and cinematic lore content",
      "Expansion of the Shacko universe and character development",
      "Community participation in story arcs and world building",
    ],
    description:
      "This phase establishes Shacko as a growing digital IP, combining storytelling with interactive experiences.",
  },
  {
    phase: "IV",
    title: "Token Economy",
    status: "upcoming",
    color: "from-[#10b981] to-[#059669]",
    icon: Coins,
    items: [
      "Launch of the $SHACK ecosystem token",
      "Implementation of $xSHACK → $SHACK conversion mechanics",
      "Airdrop of $SHACK tokens to Genesis holders",
      "Token integration across Shacko platform utilities",
      "Reward incentives through staking, platform activity, and community participation",
    ],
    description:
      "The Shacko token economy will serve as the fuel of the ecosystem, enabling rewards, governance opportunities, and deeper engagement within the platform.",
  },
  {
    phase: "V",
    title: "Ecosystem Evolution",
    status: "upcoming",
    color: "from-[#8b5cf6] to-[#7c3aed]",
    icon: Sparkles,
    items: [
      "Launch of Shacko Gen-02",
      "New characters and expansions within the Shacko universe",
      "Additional platform features and interactive experiences",
      "Expanded reward mechanisms for Genesis holders",
    ],
    description:
      "Gen-02 will expand the Shacko world while maintaining the Genesis collection as the foundation of the ecosystem.",
  },
  {
    phase: "VI",
    title: "Brand & Cultural Expansion",
    status: "upcoming",
    color: "from-[#f59e0b] to-[#d97706]",
    icon: Store,
    items: [
      "Launch of the Shacko Store and merchandise",
      "Collaborations with creators and artists",
      "Expansion into new digital experiences and entertainment formats",
      "Exploration of real-world activations and events",
    ],
    description:
      "The long-term vision is for Shacko to evolve into a Web3-native brand and entertainment ecosystem driven by community and creativity.",
  },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Header />

      {/* Marquee Banner */}
      <div className="fixed top-20 left-0 right-0 bg-gradient-to-r from-[#1a1f3a] to-[#0f1729] py-3 z-40 overflow-hidden border-b-2 border-[#2a3f5f]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-2xl font-bold text-white mx-8">
              THE JOURNEY BEGINS <span className="text-[#0ea5e9]">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[12vw] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              letterSpacing: "0.05em",
              textShadow: "4px 4px 0px rgba(0,0,0,0.2)",
            }}
          >
            THE ROADMAP
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 font-bold max-w-3xl mx-auto uppercase tracking-wide"
          >
            FROM THE DEPTHS TO THE SURFACE — THE SHACKO JOURNEY
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e]">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] mb-12 text-center"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            ABOUT SHACKO
          </h2>

          <div className="space-y-6 text-gray-300 text-lg md:text-xl leading-relaxed">
            <p className="font-semibold">
              Shacko is a Web3-native brand and digital ecosystem built around a collection of 888 sharks
              emerging from the depths of the digital ocean. More than just an NFT collection, Shacko represents
              a growing platform where community, culture, and interactive experiences converge.
            </p>

            <p className="font-semibold">
              At its core, Shacko is about strategy, resilience, and opportunity. Much like sharks navigating
              the unpredictable currents of the ocean, the Shacko community thrives in the dynamic environment
              of Web3 by embracing innovation, collaboration, and calculated risk.
            </p>

            <p className="font-semibold">
              The Shacko ecosystem is designed to extend beyond static collectibles. Through the development of
              an integrated platform featuring interactive experiences such as Arcade, Shacko Pump, staking
              systems, rewards, and storytelling through the Shacko Theatre, holders gain access to an expanding
              universe of utility and entertainment.
            </p>

            <p className="font-semibold">
              Only 888 Shacko exist, each representing a member of the order — a participant in shaping the
              future of the ecosystem and exploring new depths of Web3 innovation.
            </p>

            <p className="text-2xl font-black text-center mt-12 text-[#00d9ff]">Welcome to the deep. 🦈</p>
          </div>
        </div>
      </section>

      {/* Roadmap Phases */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2d1b4e] to-[#0a0e27]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-7xl md:text-9xl font-black text-white text-center mb-20"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            THE PHASES
          </h2>

          <div className="space-y-16">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = phase.status === "active";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br ${phase.color} rounded-3xl border-4 border-black p-8 md:p-12 shadow-2xl`}
                >
                  {/* Status Badge */}
                  {isActive && (
                    <div className="absolute top-6 right-6 bg-[#10b981] text-white px-6 py-2 rounded-full font-black text-sm uppercase border-2 border-black shadow-lg">
                      In Progress
                    </div>
                  )}

                  {/* Phase Header */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center flex-shrink-0">
                      <Icon size={40} className="text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-7xl font-black text-white opacity-30">
                          {phase.phase}
                        </span>
                        <h3
                          className="text-5xl md:text-6xl font-black text-white"
                          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                        >
                          {phase.title}
                        </h3>
                      </div>

                      <p className="text-xl text-white/90 font-semibold italic mb-6">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  {/* Phase Items */}
                  <div className="space-y-4 bg-black/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                    {phase.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        {isActive ? (
                          <CheckCircle size={24} className="text-white flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle size={24} className="text-white/60 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-lg text-white font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2
              className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#ec4899]"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              JOIN THE SYNDICATE
            </h2>

            <p className="text-2xl md:text-3xl text-gray-300 font-bold uppercase">
              ONLY 888 EXIST. BECOME PART OF THE ORDER.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <a href="/">
                <button className="group flex items-center gap-4 bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] text-black border-4 border-black rounded-full px-12 py-6 hover:scale-105 transition-all shadow-lg font-black text-xl">
                  <span className="text-3xl">🦈</span>
                  <span>View Collection</span>
                </button>
              </a>

              <a href="/lore">
                <button className="group flex items-center gap-4 bg-black text-white border-4 border-white rounded-full px-12 py-6 hover:scale-105 transition-all shadow-lg font-black text-xl">
                  <span className="text-3xl">📜</span>
                  <span>Read Lore</span>
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
