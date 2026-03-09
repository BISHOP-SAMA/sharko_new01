"use client";

import { useState } from "react";
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

// Generate paths for 1-30.png
const collectionImages = Array.from({ length: 30 }, (_, i) => `/assets/${i + 1}.png`);
const topRow = collectionImages.slice(0, 15);
const bottomRow = collectionImages.slice(15, 30);

const team = [
  { name: "BISHOP", role: "Product Manager", image: bishopImage, bio: "Jack of all trades." },
  { name: "ALLWELL", role: "Developer", image: allwellImage, bio: "Always pitching ideas." },
  { name: "KAGE", role: "CM", image: kageImage, bio: "The missing piece." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] selection:bg-[#0ea5e9] selection:text-white overflow-x-hidden text-slate-900 font-sans">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 bg-white border-2 border-[#0ea5e9]/10 rounded-full text-[#0ea5e9] font-bold text-sm mb-8 shadow-sm"
          >
            🦈 WELCOME TO THE PACK
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl md:text-9xl font-[Bangers] text-[#0ea5e9] leading-[0.8] mb-8 uppercase italic"
          >
            CHOMP. COLLECT. <span className="text-slate-800">SHACKO.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full max-w-5xl"
          >
            <img src={heroImage} alt="New Shacko Hero" className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700" />
          </motion.div>
        </div>
      </section>

      {/* 2. THE DEEP (Intro Section) */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-[Bangers] text-slate-800 mb-8 italic">THE DEEP</h2>
          <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
            <span className="text-[#0ea5e9] font-bold">888 unique 2D sharks</span>, meticulously designed with bold personalities and rare traits. 
            Shacko merges art, community, and culture into a thriving world of fins, mischief, and ocean vibes.
          </p>
        </div>
      </section>

      {/* 3. AZUKI-STYLE COLLECTION SCROLL */}
      <section className="py-20 bg-slate-50 overflow-hidden flex flex-col gap-6">
        {/* Top Row: Left to Right */}
        <div className="flex">
          <motion.div 
            animate={{ x: [0, -1920] }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...topRow, ...topRow].map((src, i) => (
              <img key={i} src={src} className="w-48 h-48 rounded-[2rem] border-4 border-white shadow-md object-cover" alt="Shacko NFT" />
            ))}
          </motion.div>
        </div>
        {/* Bottom Row: Right to Left */}
        <div className="flex">
          <motion.div 
            animate={{ x: [-1920, 0] }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...bottomRow, ...bottomRow].map((src, i) => (
              <img key={i} src={src} className="w-48 h-48 rounded-[2rem] border-4 border-white shadow-md object-cover" alt="Shacko NFT" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. WORLD BUILDING */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-[#0ea5e9] rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center shadow-2xl">
          <div className="md:w-1/2 p-12 lg:p-20 text-white">
            <h2 className="text-5xl md:text-7xl font-[Bangers] mb-6 italic">A world where every shark has a story</h2>
            <p className="text-xl opacity-90 mb-10 font-medium">Dive into the lore of Shacko and discover how the pack took over the ocean.</p>
            <Link href="/lore">
              <button className="bg-white text-[#0ea5e9] px-10 py-5 rounded-full font-black uppercase text-xl shadow-[0_6px_0_0_#cbd5e1] hover:translate-y-1 hover:shadow-none transition-all">
                Enter The Lore
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 p-6">
            <img src={worldBuildingImage} alt="Lore Image" className="w-full h-auto rounded-[2rem]" />
          </div>
        </div>
      </section>

      {/* 5. ROADMAP & GALLERY CTAs */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        <Link href="/roadmap">
          <div className="group cursor-pointer bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <img src={roadmapThumbnail} alt="Roadmap" className="w-full h-64 object-cover rounded-[2rem] mb-8" />
            <h3 className="text-4xl font-[Bangers] text-slate-800 italic uppercase">The Roadmap</h3>
            <p className="text-slate-500 font-bold">See where the chomp leads next →</p>
          </div>
        </Link>
        <Link href="/gallery">
          <div className="group cursor-pointer bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-center text-center">
            <div className="aspect-square bg-slate-100 rounded-[2rem] flex items-center justify-center mb-8">
               <span className="text-8xl">🖼️</span>
            </div>
            <h3 className="text-4xl font-[Bangers] text-[#0ea5e9] italic uppercase">The Gallery</h3>
            <p className="text-slate-500 font-bold">Browse the full 888 collection →</p>
          </div>
        </Link>
      </section>

      {/* 6. MEET THE SQUAD (Now at bottom) */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-[Bangers] text-slate-800 italic">MEET THE SQUAD</h2>
            <p className="text-xl font-bold text-slate-400">THE CREW MAKING THE OCEAN SHAKE</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
                <img src={member.image} className="w-full aspect-square object-cover rounded-[2rem] mb-6 border-4 border-slate-50" alt={member.name} />
                <h4 className="text-3xl font-[Bangers] text-[#0ea5e9] uppercase italic">{member.name}</h4>
                <p className="font-black text-slate-800 text-sm mb-2">{member.role}</p>
                <p className="text-slate-500 text-sm italic">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
