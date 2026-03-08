"use client";

import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import MobileMenu from "@/components/MobileMenu"; // default import
import { Footer } from "@/components/Footer";
import { Gamepad2, Trophy, Zap, Coins } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/logo-shark.png";

export default function Arcade() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: connect to real newsletter (e.g. Mailchimp API)
      setSubscribed(true);
      setEmail("");
    }
  };

  const games = [
    {
      title: "Shark Chomp",
      description: "Eat fish, avoid hooks, get bigger — classic arcade style",
      status: "Coming Soon",
      icon: <Gamepad2 className="w-10 h-10" />,
    },
    {
      title: "Pump Runner",
      description: "Endless runner with SHACKO pumps & power-ups",
      status: "In Development",
      icon: <Zap className="w-10 h-10" />,
    },
    {
      title: "Shark Royale",
      description: "Battle royale — last shark swimming wins the pot",
      status: "Planned",
      icon: <Trophy className="w-10 h-10" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-x-hidden relative">
      {/* Scanline overlay for arcade feel */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_50%,transparent_50%)] bg-[length:100%_6px] opacity-30 z-30" />

      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-[#0ea5e9]/30">
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
            <a href="/arcade" className="text-[#0ea5e9] font-bold">Arcade</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md px-8 py-4 rounded-full mb-8 border border-[#0ea5e9]/40"
          >
            <Gamepad2 className="w-8 h-8 text-[#0ea5e9]" />
            <span className="text-2xl font-[Bangers] text-[#0ea5e9]">ARCADE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-[Bangers] text-white mb-6 tracking-tight drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]"
          >
            INSERT <span className="text-[#0ea5e9]">COIN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-3xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Play, win, earn $ASS tokens. Coming soon — bite-sized shark chaos.
          </motion.p>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-md mx-auto"
          >
            {subscribed ? (
              <div className="bg-[#0ea5e9]/20 border-2 border-[#0ea5e9] rounded-2xl p-8 text-center">
                <h3 className="text-3xl font-[Bangers] text-white mb-4">You're in the high score list!</h3>
                <p className="text-lg text-gray-200">We'll ping you when the games drop. Get ready to chomp!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 h-14 px-6 rounded-xl border-4 border-black bg-black/40 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                />
                <button
                  type="submit"
                  className="h-14 px-10 bg-[#0ea5e9] text-black font-[Bangers] text-xl rounded-xl border-4 border-black hover:bg-[#0ea5e9]/90 hover:scale-105 transition-all"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Games Teaser */}
      <section className="py-16 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-[Bangers] text-center text-white mb-12">
            Coming Soon Games
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {games.map((game, i) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-3xl p-8 border-2 border-[#0ea5e9]/30 hover:border-[#ec4899] transition-all group"
              >
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-black/40 text-[#0ea5e9] group-hover:scale-110 transition-transform">
                  {game.icon}
                </div>
                <h3 className="text-3xl font-[Bangers] text-center text-white mb-4">{game.title}</h3>
                <p className="text-center text-gray-300 mb-6">{game.description}</p>
                <div className="text-center">
                  <span className="inline-block bg-black/50 px-6 py-2 rounded-full text-[#0ea5e9] font-bold">
                    {game.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* High Score Teaser */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-[Bangers] text-white mb-10">
            High Score Leaderboard
          </h2>

          <div className="bg-black/50 backdrop-blur-md border-2 border-[#0ea5e9]/30 rounded-2xl p-10">
            <p className="text-xl text-gray-300 mb-6">
              Be the first to top the board when the games launch!
            </p>
            <div className="text-6xl font-[Bangers] text-[#0ea5e9] mb-4">
              00000
            </div>
            <p className="text-lg text-gray-400">— Current high score placeholder —</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}