"use client";

import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

// Assets
import heroImage from "@assets/New1.png";
import worldBuildingImage from "@assets/New02.png";
import roadmapThumbnail from "@assets/New3.png";
import bishopImage from "@assets/Bishop.jpg";
import allwellImage from "@assets/Allwell.jpg";
import kageImage from "@assets/Kage.jpg";

// Generate paths for 1.jpg to 30.jpg
const topRow = Array.from({ length: 15 }, (_, i) => `/assets/${i + 1}.jpg`);
const bottomRow = Array.from({ length: 15 }, (_, i) => `/assets/${i + 16}.jpg`);

const team = [
  { name: "BISHOP", role: "Product Manager", image: bishopImage, color: "from-pink-400 to-rose-600" },
  { name: "ALLWELL", role: "Developer", image: allwellImage, color: "from-blue-400 to-indigo-600" },
  { name: "KAGE", role: "CM", image: kageImage, color: "from-amber-400 to-orange-600" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0ea5e9] selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `url("radial-gradient(#fff 2px, transparent 2px)")`, backgroundSize: '40px 40px' }} />
      
      <Header />

      {/* 1. VIBRANT HERO */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[12vw] font-[Bangers] text-white leading-[0.8] mb-8 uppercase italic drop-shadow-[0_10px_0_rgba(0,0,0,0.2)]"
          >
            CHOMP. <span className="text-[#fbbf24]">COLLECT.</span> SHACKO.
          </motion.h1>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative inline-block"
          >
            {/* Glow effect behind hero */}
            <div className="absolute inset-0 bg-white/30 blur-[100px] rounded-full" />
            <img src={heroImage} alt="Hero" className="relative w-full max-w-5xl h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
          </motion.div>
        </div>
      </section>

      {/* 2. THE DEEP (High-Contrast Glassmorphism) */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[4rem] p-12 md:p-20 text-center shadow-2xl">
          <h2 className="text-6xl md:text-8xl font-[Bangers] text-white mb-6 italic tracking-tighter">THE DEEP</h2>
          <p className="text-2xl md:text-4xl text-white font-black leading-tight uppercase">
            888 unique <span className="text-[#fbbf24]">2D sharks</span>. 
            Meticulously designed. <span className="text-[#ec4899]">Bold personalities</span>. 
            Ocean vibes.
          </p>
        </div>
      </section>

      {/* 3. AZUKI-STYLE SCROLL (Now with vibrant borders) */}
      <section className="py-12 space-y-8">
        <div className="flex rotate-[-2deg] scale-105">
          <motion.div 
            animate={{ x: [0, -2000] }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-4"
          >
            {[...topRow, ...topRow].map((src, i) => (
              <img key={i} src={src} className="w-56 h-56 rounded-3xl border-8 border-white shadow-xl object-cover flex-shrink-0" />
            ))}
          </motion.div>
        </div>
        <div className="flex rotate-[2deg] scale-105">
          <motion.div 
            animate={{ x: [-2000, 0] }} 
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex gap-4"
          >
            {[...bottomRow, ...bottomRow].map((src, i) => (
              <img key={i} src={src} className="w-56 h-56 rounded-3xl border-8 border-white shadow-xl object-cover flex-shrink-0" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. WORLD BUILDING (Vibrant Blue to Deep Navy Gradient) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] rounded-[4rem] overflow-hidden flex flex-col md:flex-row items-center border-4 border-white/10 shadow-3xl">
          <div className="md:w-1/2 p-12 lg:p-20">
            <h2 className="text-6xl md:text-8xl font-[Bangers] text-white mb-6 italic uppercase leading-none">
              A world where <br/> every shark <br/> <span className="text-[#0ea5e9]">has a story</span>
            </h2>
            <Link href="/lore">
              <button className="bg-[#fbbf24] text-black px-12 py-6 rounded-3xl font-black uppercase text-2xl shadow-[0_10px_0_0_#b45309] hover:translate-y-1 hover:shadow-none transition-all">
                DIVE INTO LORE
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 p-8">
            <img src={worldBuildingImage} alt="World Building" className="w-full h-auto rounded-[3rem] shadow-2xl border-4 border-white/10" />
          </div>
        </div>
      </section>

      {/* 5. ROADMAP & GALLERY (Bento-style with Color Pops) */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        <Link href="/roadmap">
          <div className="group bg-[#fbbf24] p-4 rounded-[4rem] border-4 border-black shadow-[15px_15px_0_0_#000] cursor-pointer hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
            <img src={roadmapThumbnail} alt="Roadmap" className="w-full h-80 object-cover rounded-[3rem] mb-6 border-4 border-black" />
            <div className="px-6 pb-6">
              <h3 className="text-5xl font-[Bangers] text-black italic">THE ROADMAP</h3>
              <p className="text-black/60 font-black uppercase tracking-widest text-sm italic">See the future →</p>
            </div>
          </div>
        </Link>
        <Link href="/gallery">
          <div className="group bg-[#ec4899] p-12 rounded-[4rem] border-4 border-black shadow-[15px_15px_0_0_#000] cursor-pointer hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex flex-col justify-center items-center text-center">
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-8 border-8 border-black shadow-xl">
              <span className="text-8xl">🖼️</span>
            </div>
            <h3 className="text-6xl font-[Bangers] text-white italic">THE GALLERY</h3>
            <p className="text-white font-black uppercase tracking-widest text-sm italic">Browse all 888 →</p>
          </div>
        </Link>
      </section>

      {/* 6. MEET THE SQUAD (Vibrant Cards) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl md:text-9xl font-[Bangers] text-white text-center mb-20 italic drop-shadow-lg">MEET THE SQUAD</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-b ${member.color} rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform`} />
                <div className="relative bg-white border-4 border-black p-6 rounded-[3rem] shadow-xl text-center hover:-translate-y-4 transition-transform">
                  <img src={member.image} className="w-full aspect-square object-cover rounded-[2rem] mb-6 border-4 border-black" alt={member.name} />
                  <h4 className="text-4xl font-[Bangers] text-black italic">{member.name}</h4>
                  <p className="font-black text-[#0ea5e9] uppercase text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
