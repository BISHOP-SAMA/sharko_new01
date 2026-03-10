"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Waves, Eye, Zap } from "lucide-react";

export default function Lore() {
  const loreParagraphs = [
    "In the deepest parts of the ocean — far beyond where light dares to reach — an ancient order was born.",
    "Not kings. Not rulers. Hunters.",
    "They were known as Shacko.",
    "For centuries, the ocean existed in chaos. Massive whales dominated the tides, smaller creatures followed the currents, and entire civilizations rose and vanished beneath the waves.",
    "But in the shadows of the deep, a different power was forming.",
    "The Shacko.",
    "Unlike the creatures that drifted with the currents, the Shacko learned to control them. They studied the patterns of the ocean, mastered its hidden pathways, and built a silent syndicate that operated far beneath the surface.",
    "They were patient. They were strategic. And when the moment came — they struck.",
    "As the oceans evolved, so did the Shacko. New territories emerged, ancient forces awakened, and the balance of power began to shift.",
    "Now the syndicate begins to surface.",
    "Only 888 Shacko will rise from the depths — each one a member of the order, each one carrying the instincts of the deep.",
    "Together, they will explore uncharted waters, uncover lost territories, and shape the future of the ocean itself.",
    "The tides are changing.",
    "And the Shacko are coming.",
  ];

  const chapters = [
    {
      icon: Eye,
      title: "The Awakening",
      description: "From the depths, they watch. From the shadows, they learn.",
    },
    {
      icon: Waves,
      title: "The Syndicate",
      description: "888 sharks. One order. Infinite power.",
    },
    {
      icon: Zap,
      title: "The Rising",
      description: "The surface world is about to meet the deep.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden relative">
      {/* Deep ocean ambient glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.08),transparent_70%)] z-0" />
      
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0ea5e9]/20 to-[#ec4899]/20 backdrop-blur-sm px-8 py-4 rounded-full mb-8 border-2 border-[#00d9ff]/30">
              <span className="text-2xl">📜</span>
              <span className="text-2xl font-black text-[#00d9ff]" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                THE LEGEND
              </span>
            </div>

            <h1
              className="text-[15vw] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] via-[#0ea5e9] to-[#ec4899] leading-none mb-8"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: "0 0 80px rgba(0, 217, 255, 0.5)",
              }}
            >
              THE LORE
            </h1>

            <p className="text-2xl md:text-3xl text-gray-400 font-bold max-w-3xl mx-auto">
              From the depths they came. To the depths they return.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chapter Icons */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {chapters.map((chapter, index) => {
            const Icon = chapter.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-[#00d9ff]/30 rounded-3xl p-8 text-center hover:border-[#00d9ff] transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00d9ff]/20 flex items-center justify-center">
                  <Icon size={40} className="text-[#00d9ff]" />
                </div>
                <h3
                  className="text-3xl font-black text-white mb-4"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  {chapter.title}
                </h3>
                <p className="text-gray-400 font-semibold">{chapter.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Main Lore Content */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2d1b4e] to-[#0a0e27]">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12 text-lg md:text-2xl leading-relaxed">
            {loreParagraphs.map((paragraph, index) => {
              // Highlight key phrases
              const isKeyPhrase = index === 2 || index === 5 || index === 9 || index === 12 || index === 13;
              
              return (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className={
                    isKeyPhrase
                      ? "text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#ec4899] text-center py-8"
                      : "text-gray-300 font-medium"
                  }
                  style={isKeyPhrase ? { fontFamily: "'Bebas Neue', 'Impact', sans-serif" } : {}}
                >
                  {paragraph}
                </motion.p>
              );
            })}
          </div>

          {/* Dramatic Close */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-32 text-center"
          >
            <div className="relative inline-block">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ec4899] to-[#f97316] blur-3xl opacity-40 rounded-3xl" />
              
              <div className="relative bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-4 border-[#ec4899] rounded-3xl px-12 py-10 shadow-2xl">
                <p
                  className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#f97316] mb-6"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  THE DEEP CALLS
                </p>
                <p className="text-2xl md:text-3xl text-gray-300 font-bold">
                  Will you answer?
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-20 flex flex-col sm:flex-row gap-6 justify-center"
          >
            <a href="/">
              <button className="group flex items-center gap-3 bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] text-black border-4 border-black rounded-full px-10 py-5 hover:scale-105 transition-all shadow-lg font-black text-lg">
                <span className="text-2xl">🦈</span>
                <span>JOIN THE ORDER</span>
              </button>
            </a>

            <a href="/roadmap">
              <button className="group flex items-center gap-3 bg-black text-white border-4 border-[#00d9ff] rounded-full px-10 py-5 hover:scale-105 transition-all shadow-lg font-black text-lg">
                <span className="text-2xl">🗺️</span>
                <span>VIEW ROADMAP</span>
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="text-8xl text-[#00d9ff]/20 mb-4">"</div>
            <p
              className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] mb-8 italic"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              IN THE DEEP, WE ARE ALL EQUAL. IN THE SYNDICATE, WE ARE UNSTOPPABLE.
            </p>
            <div className="text-8xl text-[#00d9ff]/20 text-right">"</div>
            <p className="text-xl text-gray-500 font-bold uppercase tracking-widest mt-8">
              — Ancient Shacko Proverb
            </p>
          </motion.blockquote>
        </div>
      </section>

      <Footer />
    </div>
  );
}
