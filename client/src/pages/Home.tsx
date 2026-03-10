"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, Search, Paintbrush, Gem } from "lucide-react";

// Import your images
import heroImage from "@assets/New1.png";
import aboutImage from "@assets/New3.png";
import stakingImage from "@assets/New03.png";
import raffleImage from "@assets/New2.png";

// Generate paths for gallery grid (1.jpg to 30.jpg)
const galleryImages = Array.from({ length: 30 }, (_, i) => `/assets/${i + 1}.jpg`);

// Team data
const team = [
  {
    name: "BISHOP",
    role: "Product Manager",
    image: "/assets/Bishop.jpg",
    traits: ["Jack of all trades", "Works without break", "Part time degen"],
  },
  {
    name: "ALLWELL",
    role: "Developer",
    image: "/assets/Allwell.jpg",
    traits: [
      "He's the small voice you hear in your head sometimes",
      "Always pitching ideas somewhere to someone",
      "Fast learner",
    ],
  },
  {
    name: "KAGE",
    role: "CM",
    image: "/assets/Kage.jpg",
    traits: [
      "Loses money everyday trading",
      "Collaborative learner",
      "The missing piece your project needs",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Header />

      {/* HERO SECTION - THE DEEP */}
      <section className="relative pt-40 pb-0 px-6 bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1729] overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* THE DEEP Title - Massive & Condensed */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[22vw] md:text-[240px] font-black text-white leading-[0.8] mb-6 tracking-tighter"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            THE DEEP
          </motion.h1>

          {/* Subtitle - Optimized for Pudgy Penguins Style (Thin, Spaced, Not Bold) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-lg text-gray-300 font-normal max-w-2xl mx-auto mb-16 leading-relaxed px-4 uppercase tracking-[0.2em] opacity-80"
          >
            888 unique 2D sharks, meticulously designed with bold personalities and rare traits.
            Shacko merges art, community, and culture into a thriving world of fins, mischief, and ocean vibes.
          </motion.p>

          {/* Hero Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#00d9ff] blur-[120px] opacity-20 rounded-full" />
            <img
              src={heroImage}
              alt="Shacko Hero"
              className="relative w-full max-w-5xl mx-auto h-auto drop-shadow-[0_0_80px_rgba(0,217,255,0.4)]"
              style={{ marginBottom: "-1px" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ABOUT SHACKO SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#f97316] mb-8 tracking-tighter leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                ABOUT SHACKO
              </h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-medium">
                <p>
                  Shacko is a Web3-native brand and digital ecosystem built around a collection of 888 sharks
                  emerging from the depths of the digital ocean.
                </p>
              </div>
              <a href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 flex items-center gap-3 bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(236,72,153,0.4)]"
                >
                  Discover More <ArrowRight size={24} />
                </motion.button>
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ec4899] to-[#f97316] blur-[100px] opacity-30 rounded-full" />
              <img src={aboutImage} alt="About" className="relative w-full rounded-3xl shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHACKO HUB - GALLERY GRID */}
      <section className="py-24 px-0 bg-[#0a0e27] overflow-hidden relative">
        <div className="max-w-7xl mx-auto mb-16 px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black mb-10 tracking-tighter"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            SHACKO <span className="text-[#00d9ff]">HUB</span>
          </motion.h2>

          {/* View All Collection - Glass Design */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-4 bg-white/5 hover:bg-[#00d9ff] border-2 border-[#00d9ff]/30 hover:border-[#00d9ff] text-[#00d9ff] hover:text-black px-12 py-4 rounded-full font-black text-lg transition-all duration-300 backdrop-blur-md shadow-[0_0_20px_rgba(0,217,255,0.1)] hover:shadow-[0_0_40px_rgba(0,217,255,0.4)]"
          >
            VIEW ALL COLLECTION
            <ArrowRight size={22} strokeWidth={3} />
          </motion.button>
        </div>

        {/* Scrolling Gallery - Reduced Sizes & Improved Loop */}
        <div className="space-y-4">
          {[
            { dir: -1, images: galleryImages.slice(0, 10), speed: 30 },
            { dir: 1, images: galleryImages.slice(10, 20), speed: 40 },
            { dir: -1, images: galleryImages.slice(20, 30), speed: 35 }
          ].map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4">
              <motion.div
                animate={{ x: row.dir === -1 ? [0, -1200] : [-1200, 0] }}
                transition={{ duration: row.speed, repeat: Infinity, ease: "linear" }}
                className="flex gap-4 flex-shrink-0"
              >
                {/* Tripled buffer for a perfect loop */}
                {[...row.images, ...row.images, ...row.images].map((src, i) => (
                  <div
                    key={i}
                    className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden border border-white/10 group flex-shrink-0 transition-transform duration-500"
                  >
                    <div className="absolute inset-0 bg-[#00d9ff]/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                       <span className="bg-white text-black px-3 py-1 rounded-lg font-black text-xs">SHACKO</span>
                    </div>
                    <img src={src} alt="Shark" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* SHACKO SHOP SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0f1729] to-[#0a0e27]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#14b8a6] mb-12 tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            SHACKO SHOP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Explore", icon: <Search size={40} className="text-[#10b981] mx-auto" /> },
              { title: "Create", icon: <Paintbrush size={40} className="text-[#10b981] mx-auto" /> },
              { title: "Collect", icon: <Gem size={40} className="text-[#10b981] mx-auto" /> },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border-2 border-[#10b981]/20 rounded-3xl p-10 hover:border-[#10b981] transition-all">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
              </div>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white px-12 py-5 rounded-full font-black text-xl">
            COMING SOON
          </motion.button>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-32 px-6 bg-[#0a0e27]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl md:text-9xl font-black text-center mb-16 tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MEET THE CREW</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#00d9ff] transition-all group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 border-2 border-transparent group-hover:border-[#00d9ff]">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-4xl font-black text-[#00d9ff]">{member.name}</h3>
                <p className="text-[#ec4899] font-bold mb-4">{member.role}</p>
                <ul className="space-y-2 text-gray-400">
                  {member.traits.map((trait, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                       <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full" /> {trait}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
