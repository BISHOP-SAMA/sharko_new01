"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

// Assets
import heroImage from "@assets/Head.png";
import aboutImage from "@assets/New3.png";
import stakingImage from "@assets/New02.png";
import raffleImage from "@assets/New2.png";
import bishopImg from "@assets/Bishop.jpg";
import allwellImg from "@assets/Allwell.jpg";
import kageImg from "@assets/Kage.jpg";

const galleryImages = Array.from({ length: 30 }, (_, i) => `/assets/${i + 1}.jpg`);

const team = [
  { name: "BISHOP", role: "Product Manager", image: bishopImg, traits: ["Jack of all trades", "Works without break"] },
  { name: "ALLWELL", role: "Developer", image: allwellImg, traits: ["Always pitching ideas", "Fast learner"] },
  { name: "KAGE", role: "CM", image: kageImg, traits: ["Collaborative learner", "The missing piece"] },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden text-white font-sans">
      <Header />

      {/* 1. MARQUEE BANNER */}
      <div className="fixed top-20 left-0 right-0 bg-[#0a0e27]/80 backdrop-blur-md py-3 z-40 border-b border-[#00d9ff]/20 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-sm font-black tracking-widest text-[#00d9ff] mx-12 uppercase">
              DIVE INTO THE DEEP • 888 SHARKS • NO LEGS ALLOWED •
            </span>
          ))}
        </motion.div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-52 pb-0 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[15vw] md:text-[180px] font-black leading-none mb-4 italic"
            style={{ 
              fontFamily: "'Bebas Neue', sans-serif",
              background: "linear-gradient(to bottom, #fff, #00d9ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            THE DEEP
          </motion.h1>
          
          <motion.p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            888 unique 2D sharks, meticulously designed with bold personalities and rare traits. 
            Merging art, community, and mischief.
          </motion.p>

          <motion.div className="relative inline-block mt-10">
            <div className="absolute inset-0 bg-[#00d9ff] blur-[150px] opacity-20" />
            <img src={heroImage} className="relative w-full max-w-4xl mx-auto h-auto drop-shadow-2xl" alt="Hero" />
          </motion.div>
        </div>
      </section>

      {/* 3. AZUKI-STYLE SCROLLING GRID */}
      <section className="py-24 space-y-4 bg-[#0a0e27]">
         <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: [0, "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-4 flex-shrink-0"
            >
              {[...galleryImages, ...galleryImages].map((src, i) => (
                <img key={i} src={src} className="w-64 h-64 object-cover rounded-2xl border border-white/10" />
              ))}
            </motion.div>
          </div>
          {/* Reverse Row */}
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: ["-50%", 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-4 flex-shrink-0"
            >
              {[...galleryImages, ...galleryImages].map((src, i) => (
                <img key={i} src={src} className="w-64 h-64 object-cover rounded-2xl border border-white/10" />
              ))}
            </motion.div>
          </div>
      </section>

      {/* 4. UTILITY SECTIONS (Staking / Raffle / About) */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 gap-32">
        {/* Staking */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-8xl font-black italic text-[#fbbf24] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>STAKING</h2>
            <p className="text-xl text-gray-400 mb-8">Stake your Shacko NFTs to earn $xSHACK. Join the feeding frenzy and grow your bag.</p>
            <button className="bg-[#fbbf24] text-black px-10 py-4 rounded-full font-black flex items-center gap-2 hover:scale-105 transition-all">
              START STAKING <ArrowRight />
            </button>
          </div>
          <img src={stakingImage} className="lg:w-1/2 rounded-[3rem] shadow-2xl border border-white/10" alt="Staking" />
        </div>

        {/* Raffle */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-8xl font-black italic text-[#8b5cf6] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>RAFFLES</h2>
            <p className="text-xl text-gray-400 mb-8">Use your $xSHACK to win rare NFTs, merch, and Allowlist spots.</p>
            <button className="bg-[#8b5cf6] text-white px-10 py-4 rounded-full font-black flex items-center gap-2 hover:scale-105 transition-all">
              ENTER RAFFLE <ArrowRight />
            </button>
          </div>
          <img src={raffleImage} className="lg:w-1/2 rounded-[3rem] shadow-2xl border border-white/10" alt="Raffle" />
        </div>
      </section>

      {/* 5. THE SQUAD */}
      <section className="py-32 px-6 bg-gradient-to-t from-[#000] to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-8xl font-black text-center mb-20 italic" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>THE SQUAD</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-[#1a1f3a] p-8 rounded-[3rem] border border-white/5 hover:border-[#00d9ff]/50 transition-all">
                <img src={member.image} className="w-full aspect-square object-cover rounded-2xl mb-6" alt={member.name} />
                <h3 className="text-3xl font-black italic text-[#00d9ff]">{member.name}</h3>
                <p className="text-gray-500 uppercase font-bold text-xs mb-4">{member.role}</p>
                <ul className="text-gray-400 text-sm space-y-1 italic">
                  {member.traits.map((t, j) => <li key={j}>• {t}</li>)}
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
