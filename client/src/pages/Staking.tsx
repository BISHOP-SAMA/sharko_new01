import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import { Footer } from "@/components/Footer";
import logoImage from "@assets/logo-shark.png";
import { Link } from "wouter";

export default function Staking() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      <FloatingSharks />
      
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

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 bg-white border-4 border-black p-8 rounded-3xl comic-shadow">
            <h1 className="text-6xl font-[Bangers] text-[#0ea5e9] text-stroke mb-4">FEED YOUR SHACKO</h1>
            <p className="text-xl font-bold text-slate-600">Stake your NFTs to earn $ASS tokens!</p>
          </div>

          {/* How it Works Section */}
          <div className="mb-12 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] border-4 border-black rounded-3xl p-8 comic-shadow">
            <h2 className="text-4xl font-[Bangers] text-white mb-8 text-center">How it works</h2>
            
            <div className="space-y-4">
              <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Choose an NFT</h3>
                    <p className="text-gray-300">Pick rarity, preview daily rate, and start a stake.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Lock duration</h3>
                    <p className="text-gray-300">Select 7, 14, 30, or 60 days. Higher commitment, steadier grind.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a]/50 border-2 border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Claim anytime</h3>
                    <p className="text-gray-300">Track earned vs claimable and harvest $ASS when you want.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] border-4 border-black rounded-3xl p-16 comic-shadow text-center"
          >
            <div className="text-8xl mb-6">🦈</div>
            <h2 className="text-6xl font-[Bangers] text-white mb-4">COMING SOON!</h2>
            <p className="text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Staking is swimming your way! Connect your wallet and earn $ASS tokens soon.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/rewards">
                <a className="bg-[#0ea5e9] text-white px-8 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform inline-block">
                  VIEW REWARDS →
                </a>
              </Link>
              <a
                href="https://discord.gg/dfxMGDTnpM"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#0ea5e9] px-8 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform inline-block"
              >
                JOIN DISCORD
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
