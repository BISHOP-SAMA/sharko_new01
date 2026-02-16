import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import { Footer } from "@/components/Footer";  // ← Add this import
import logoImage from "@assets/logo-shark.png";
import bishopImage from "@assets/Bishop.jpg";
import allwellImage from "@assets/Allwell.jpg";
import kageImage from "@assets/Kage.jpg";
import pumpImage from "@assets/shacko-pump.png";
import { Link } from "wouter";
import { useState } from "react";
import { ComicButton } from "@/components/ui/comic-button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Clock, Trophy } from "lucide-react";

const nfts = [
  { id: 1, name: "SHACKO #001", rarity: "Legendary", image: bishopImage, multiplier: 5 },
  { id: 2, name: "SHACKO #042", rarity: "Rare", image: allwellImage, multiplier: 3 },
  { id: 3, name: "SHACKO #133", rarity: "Common", image: kageImage, multiplier: 1 },
  { id: 4, name: "SHACKO #777", rarity: "Uncommon", image: pumpImage, multiplier: 2 },
];

export default function Staking() {
  const { toast } = useToast();
  const [stakedIds, setStakedIds] = useState<number[]>([]);
  const [balance, setBalance] = useState(0);

  const toggleStake = (id: number) => {
    if (stakedIds.includes(id)) {
      setStakedIds(stakedIds.filter(i => i !== id));
      toast({ title: "Unstaked!", description: "Your Shacko is resting." });
    } else {
      setStakedIds([...stakedIds, id]);
      toast({ title: "Staked!", description: "Feeding your Shacko $ASS...", className: "bg-[#22c55e] text-white" });
    }
  };

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
          {/* Header with Balance */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white border-4 border-black p-8 rounded-3xl comic-shadow">
            <div className="text-center md:text-left">
              <h1 className="text-6xl font-[Bangers] text-[#0ea5e9] text-stroke">FEED YOUR SHACKO</h1>
              <p className="text-xl font-bold text-slate-600">Stake your NFTs to earn $ASS tokens!</p>
            </div>
            <div className="bg-[#1e3a5f] border-4 border-black p-6 rounded-2xl text-center min-w-[200px]">
              <p className="text-[#38bdf8] font-[Bangers] text-xl">YOUR BALANCE</p>
              <p className="text-white font-[Bangers] text-4xl">{balance} $ASS</p>
            </div>
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

            {/* Pro Tip */}
            <div className="mt-6 bg-gradient-to-r from-[#0ea5e9]/20 to-[#38bdf8]/20 border-2 border-[#0ea5e9]/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-[#0ea5e9] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Pro tip</h4>
                  <p className="text-gray-300">Connect your wallet to see your active stakes instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {nfts.map((nft) => (
              <motion.div
                key={nft.id}
                whileHover={{ y: -10 }}
                className="bg-white border-4 border-black rounded-3xl overflow-hidden comic-shadow flex flex-col"
              >
                <div className="aspect-square border-b-4 border-black relative">
                  <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border-2 border-black font-bold text-sm ${
                    nft.rarity === 'Legendary' ? 'bg-yellow-400' :
                    nft.rarity === 'Rare' ? 'bg-purple-400' :
                    nft.rarity === 'Uncommon' ? 'bg-blue-400' : 'bg-slate-300'
                  }`}>
                    {nft.rarity}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-[Bangers] mb-1">{nft.name}</h3>
                    <p className="font-bold text-slate-500 mb-4">{nft.multiplier}x Multiplier</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <ComicButton 
                      variant={stakedIds.includes(nft.id) ? "accent" : "primary"}
                      className="flex-1"
                      onClick={() => toggleStake(nft.id)}
                    >
                      {stakedIds.includes(nft.id) ? "UNSTAKE" : "STAKE"}
                    </ComicButton>
                    
                    <Link href="/rewards">
                      <a>
                        <ComicButton 
                          variant="secondary"
                          className="px-4"
                          title="View Rewards"
                        >
                          <Trophy className="w-5 h-5" />
                        </ComicButton>
                      </a>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />  {/* ← Add the footer here */}
    </div>
  );
}
