"use client";

import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import MobileMenu from "@/components/MobileMenu"; // default import
import { Footer } from "@/components/Footer";
import logoImage from "@assets/logo-shark.png";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000814] via-[#001122] to-[#0a1f3f] text-white overflow-x-hidden relative">
      {/* Deep ocean vignette overlay */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70 z-10" />

      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#000814]/90 backdrop-blur-md border-b border-[#0ea5e9]/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
            <span className="text-3xl font-[Bangers] text-white tracking-wider">SHACKO</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="hover:text-[#0ea5e9] transition-colors">Home</a>
            <a href="/about" className="hover:text-[#0ea5e9] transition-colors">About</a>
            <a href="/staking" className="hover:text-[#0ea5e9] transition-colors">Staking</a>
            <a href="/lore" className="text-[#0ea5e9] font-bold">Lore</a>
          </div>
        </div>
      </nav>

      {/* Lore Content */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-6xl md:text-9xl font-[Bangers] text-center text-white mb-16 tracking-tight drop-shadow-2xl"
          >
            THE <span className="text-[#0ea5e9]">LORE</span>
          </motion.h1>

          <div className="space-y-10 md:space-y-12 text-lg md:text-2xl leading-relaxed text-gray-200 font-light">
            {loreParagraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: index * 0.15 }}
                className={`${
                  index === 2 || index === 13
                    ? "text-3xl md:text-5xl font-[Bangers] text-[#0ea5e9] text-center tracking-wide"
                    : ""
                }`}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Final dramatic close */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 2 }}
            className="mt-20 text-center"
          >
            <div className="inline-block bg-black/60 backdrop-blur-md border-2 border-[#0ea5e9]/40 rounded-2xl px-12 py-8">
              <p className="text-3xl md:text-5xl font-[Bangers] text-[#ec4899] mb-4">
                The deep calls.
              </p>
              <p className="text-xl text-gray-300">
                Will you answer?
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}