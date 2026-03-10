"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Waves, Users, Zap, Target, Rocket, Shield } from "lucide-react";

const features = [
  {
    icon: Waves,
    title: "The Deep",
    description: "888 unique sharks emerging from the depths of the digital ocean, each with bold personalities and rare traits.",
    gradient: "from-[#0ea5e9] to-[#38bdf8]",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built on Base, powered by a thriving community that values collaboration, innovation, and calculated risk.",
    gradient: "from-[#ec4899] to-[#f97316]",
  },
  {
    icon: Zap,
    title: "Real Utility",
    description: "Staking rewards, raffles, arcade games, and storytelling through the Shacko Theatre - utility that actually matters.",
    gradient: "from-[#fbbf24] to-[#f59e0b]",
  },
  {
    icon: Target,
    title: "Strategy & Resilience",
    description: "Like sharks navigating ocean currents, the Shacko community thrives by embracing innovation and opportunity.",
    gradient: "from-[#10b981] to-[#14b8a6]",
  },
  {
    icon: Rocket,
    title: "Growing Ecosystem",
    description: "An integrated platform with Arcade, Pump, staking systems, rewards, and immersive storytelling experiences.",
    gradient: "from-[#8b5cf6] to-[#7c3aed]",
  },
  {
    icon: Shield,
    title: "Web3 Native",
    description: "More than NFTs - a complete digital ecosystem where community, culture, and interactive experiences converge.",
    gradient: "from-[#f59e0b] to-[#d97706]",
  },
];

const stats = [
  { number: "888", label: "Unique Sharks" },
  { number: "7", label: "One-of-Ones" },
  { number: "5", label: "Rarity Tiers" },
  { number: "∞", label: "Possibilities" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1
              className="text-[15vw] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] leading-none mb-8"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                WebkitTextStroke: "2px rgba(0, 217, 255, 0.3)",
              }}
            >
              ABOUT SHACKO
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 font-bold max-w-4xl mx-auto mb-8">
              A Web3-native brand and digital ecosystem built around 888 sharks emerging from the depths.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-[#00d9ff]/30 rounded-2xl p-6 text-center hover:border-[#00d9ff] transition-all"
              >
                <div
                  className="text-5xl md:text-6xl font-black text-[#00d9ff] mb-2"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 mb-20"
          >
            <h2
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] mb-12"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              OUR STORY
            </h2>

            <div className="space-y-6 text-gray-300 text-lg md:text-xl leading-relaxed">
              <p className="font-semibold">
                Shacko is a Web3-native brand and digital ecosystem built around a collection of 888 sharks
                emerging from the depths of the digital ocean. More than just an NFT collection, Shacko
                represents a growing platform where community, culture, and interactive experiences converge.
              </p>

              <p className="font-semibold">
                At its core, Shacko is about strategy, resilience, and opportunity. Much like sharks navigating
                the unpredictable currents of the ocean, the Shacko community thrives in the dynamic environment
                of Web3 by embracing innovation, collaboration, and calculated risk.
              </p>

              <p className="font-semibold">
                The Shacko ecosystem is designed to extend beyond static collectibles. Through the development
                of an integrated platform featuring interactive experiences such as Arcade, Shacko Pump, staking
                systems, rewards, and storytelling through the Shacko Theatre, holders gain access to an
                expanding universe of utility and entertainment.
              </p>

              <p className="font-semibold">
                Only 888 Shacko exist, each representing a member of the order — a participant in shaping the
                future of the ecosystem and exploring new depths of Web3 innovation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2d1b4e] to-[#0a0e27]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black text-white text-center mb-20"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            WHAT MAKES US DIFFERENT
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br ${feature.gradient} rounded-3xl border-4 border-black p-8 shadow-2xl hover:scale-105 transition-transform`}
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mb-6">
                    <Icon size={32} className="text-white" />
                  </div>

                  <h3
                    className="text-4xl font-black text-white mb-4"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    {feature.title}
                  </h3>

                  <p className="text-lg text-white/90 font-semibold leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#f97316] mb-12"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              OUR VISION
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 font-semibold leading-relaxed max-w-4xl mx-auto">
              To evolve Shacko into a Web3-native brand and entertainment ecosystem driven by community and
              creativity. From digital collectibles to immersive experiences, from storytelling to real-world
              activations — Shacko is building a world where innovation, art, and community converge.
            </p>

            <div className="pt-12">
              <motion.a
                href="/roadmap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] text-black px-12 py-6 rounded-full font-black text-xl border-4 border-black shadow-lg hover:shadow-2xl transition-all"
              >
                <span className="text-2xl">🗺️</span>
                <span>VIEW ROADMAP</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rounded-3xl border-4 border-black p-12 shadow-2xl"
          >
            <h2
              className="text-6xl md:text-8xl font-black text-white mb-8"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              JOIN THE ORDER
            </h2>

            <p className="text-2xl md:text-3xl text-white/90 font-bold mb-12">
              888 sharks. One ecosystem. Infinite possibilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/">
                <button className="group flex items-center gap-3 bg-black text-white border-4 border-white rounded-full px-10 py-5 hover:scale-105 transition-all shadow-lg font-black text-lg">
                  <span className="text-2xl">🦈</span>
                  <span>EXPLORE COLLECTION</span>
                </button>
              </a>

              <a href="/staking">
                <button className="group flex items-center gap-3 bg-white text-black border-4 border-black rounded-full px-10 py-5 hover:scale-105 transition-all shadow-lg font-black text-lg">
                  <span className="text-2xl">⚡</span>
                  <span>START STAKING</span>
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
