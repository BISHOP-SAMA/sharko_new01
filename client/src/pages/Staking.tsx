// pages/Staking.tsx
import React from "react";
import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import { Footer } from "@/components/Footer";
import logoImage from "@assets/logo-shark.png";
import { Link } from "wouter";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import StakeDashboard from "@/components/StakeDashboard";

export default function Staking() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
              <span className="text-3xl font-[Bangers] text-white text-stroke tracking-widest">SHACKO</span>
            </a>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about"><a className="font-[Bangers] text-xl text-white hover:text-[#ec4899]">About</a></Link>
            <Link href="/staking"><a className="font-[Bangers] text-xl text-white hover:text-[#ec4899]">Staking</a></Link>
            <Link href="/"><a className="font-[Bangers] text-xl text-white hover:text-[#ec4899]">Home</a></Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 bg-white border-4 border-black p-8 rounded-3xl comic-shadow">
            <h1 className="text-6xl font-[Bangers] text-[#0ea5e9] text-stroke mb-4">FEED YOUR SHACKO</h1>
            <p className="text-xl font-bold text-slate-600">Stake your NFTs to earn $SHACK tokens!</p>
          </div>

          {/* How it Works Section */}
          <div className="mb-12 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] border-4 border-black rounded-3xl p-8 comic-shadow">
            <h2 className="text-4xl font-[Bangers] text-white mb-8 text-center">How it works</h2>
            
            <div className="space-y-4">
              {[
                { step: 1, title: "Choose an NFT", desc: "Pick rarity, preview daily rate, and start a stake." },
                { step: 2, title: "Lock duration", desc: "Select 7, 14, 30, or 60 days. Higher commitment, steadier grind." },
                { step: 3, title: "Claim anytime", desc: "Track earned vs claimable and harvest $SHACK when you want." }
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                      <span className="text-2xl font-bold text-white">{step}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                      <p className="text-gray-300">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Connect + StakeDashboard */}
          <div className="my-12 p-8 bg-white border-4 border-black rounded-3xl comic-shadow">
            <h2 className="text-4xl font-[Bangers] text-center text-[#0ea5e9] mb-6">Stake Your Shacko NFTs</h2>
            <div className="flex justify-center mb-6">
              <ConnectButton />
            </div>
            <StakeDashboard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}