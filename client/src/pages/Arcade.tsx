"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Gamepad2, Trophy, Zap, Coins, Star, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Arcade() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const games = [
    {
      title: "SHARK CHOMP",
      description: "Eat fish, dodge obstacles, grow bigger. Classic arcade action with a bite!",
      status: "Coming Soon",
      icon: <Gamepad2 className="w-10 h-10" />,
      color: "from-[#0ea5e9] to-[#38bdf8]",
    },
    {
      title: "PUMP RUNNER",
      description: "Endless runner through the ocean. Collect $SHACK and power-ups!",
      status: "Coming Soon",
      icon: <Zap className="w-10 h-10" />,
      color: "from-[#fbbf24] to-[#f59e0b]",
    },
    {
      title: "SHARK ROYALE",
      description: "Battle royale — last shark swimming wins the prize pool!",
      status: "Coming Soon",
      icon: <Trophy className="w-10 h-10" />,
      color: "from-[#ec4899] to-[#f97316]",
    },
    {
      title: "COIN FRENZY",
      description: "Catch falling $SHACK tokens before time runs out. Fast-paced arcade fun!",
      status: "Coming Soon",
      icon: <Coins className="w-10 h-10" />,
      color: "from-[#10b981] to-[#14b8a6]",
    },
    {
      title: "DEEP DIVE",
      description: "Dive deeper, collect treasures, avoid dangers. How far can you go?",
      status: "Coming Soon",
      icon: <Star className="w-10 h-10" />,
      color: "from-[#8b5cf6] to-[#7c3aed]",
    },
    {
      title: "SHARK DASH",
      description: "Speed through underwater tunnels. Precision timing and reflexes required!",
      status: "Coming Soon",
      icon: <Sparkles className="w-10 h-10" />,
      color: "from-[#f59e0b] to-[#d97706]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden relative">
      {/* Retro Scanline Effect */}
      <div className="pointer-events-none fixed inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,217,255,0.03)_0px,rgba(0,217,255,0.03)_1px,transparent_1px,transparent_2px)] z-[60]" />
      
      {/* CRT Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.15),transparent_70%)] z-[59]" />

      <Header />

      {/* Pixelated Border Top */}
      <div className="fixed top-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent z-40" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        {/* Neon Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Arcade Token Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] px-8 py-4 rounded-full mb-8 border-4 border-black shadow-[0_0_30px_rgba(0,217,255,0.6)]"
          >
            <Gamepad2 className="w-8 h-8 text-black" />
            <span className="text-2xl font-black text-black" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
              SHACKO ARCADE
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[20vw] md:text-[180px] font-black leading-none mb-8"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              background: "linear-gradient(180deg, #00d9ff 0%, #0ea5e9 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px rgba(0,217,255,0.8), 0 0 80px rgba(236,72,153,0.6)",
            }}
          >
            INSERT COIN
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-4xl text-[#00d9ff] font-bold max-w-4xl mx-auto mb-4"
            style={{
              textShadow: "0 0 20px rgba(0,217,255,0.8)",
            }}
          >
            PLAY • WIN • EARN $SHACK
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-400 mb-12"
          >
            Retro arcade games meet Web3 rewards. Coming soon to the deep.
          </motion.p>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-md mx-auto"
          >
            {subscribed ? (
              <div className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] border-4 border-black rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.6)]">
                <h3 className="text-3xl font-black text-black mb-4" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                  PLAYER 1 READY!
                </h3>
                <p className="text-lg text-black font-bold">You're on the waitlist. Get ready to chomp!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 h-16 px-6 rounded-xl border-4 border-[#00d9ff] bg-black/80 text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#00d9ff]/50 font-bold"
                  style={{ boxShadow: "inset 0 0 20px rgba(0,217,255,0.2)" }}
                />
                <button
                  type="submit"
                  className="h-16 px-10 bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] text-black font-black text-xl rounded-xl border-4 border-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,217,255,0.6)]"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  JOIN WAITLIST
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Game Selection Screen */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center mb-20">
            <h2
              className="text-7xl md:text-9xl font-black text-white mb-6"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: "0 0 40px rgba(251,191,36,0.8)",
              }}
            >
              GAME SELECT
            </h2>
            <p className="text-2xl text-[#fbbf24] font-bold">
              Choose your game. Earn $SHACK rewards.
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, i) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative bg-gradient-to-br ${game.color} rounded-3xl p-8 border-4 border-black cursor-pointer group overflow-hidden`}
                  style={{
                    boxShadow: `0 0 30px rgba(0, 217, 255, 0.3)`,
                  }}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <motion.div
                      animate={{ y: [0, -100] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 2px, transparent 4px)`,
                      }}
                    />
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-white/30">
                    <span className="text-white font-bold text-sm uppercase tracking-wider">Coming Soon</span>
                  </div>

                  {/* Icon */}
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {Icon}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-4xl font-black text-white text-center mb-4"
                    style={{
                      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                      textShadow: "0 4px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {game.title}
                  </h3>

                  {/* Description */}
                  <p className="text-center text-white/90 font-semibold text-lg leading-relaxed">
                    {game.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* High Score Leaderboard */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2
              className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#f97316] mb-12"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: "0 0 40px rgba(236,72,153,0.8)",
              }}
            >
              HIGH SCORES
            </h2>

            <div className="bg-black/60 backdrop-blur-md border-4 border-[#00d9ff] rounded-3xl p-12 shadow-[0_0_60px_rgba(0,217,255,0.4)]">
              <p className="text-2xl text-gray-300 mb-8 font-bold">
                Be the first to top the leaderboard when games launch!
              </p>

              {/* Retro Score Display */}
              <div className="relative">
                <div
                  className="text-[120px] font-black text-[#00d9ff] mb-6 tracking-wider"
                  style={{
                    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                    textShadow: "0 0 40px rgba(0,217,255,1), 0 0 80px rgba(0,217,255,0.6)",
                  }}
                >
                  0000
                </div>
                <p className="text-xl text-gray-400 uppercase tracking-widest">
                  — READY PLAYER ONE—
                </p>
              </div>

              {/* Placeholder Leaderboard */}
              <div className="mt-12 space-y-4">
                {[1, 2, 3].map((rank) => (
                  <div
                    key={rank}
                    className="flex items-center justify-between bg-white/5 border-2 border-white/10 rounded-xl p-4"
                  >
                    <span className="text-2xl font-black text-[#fbbf24]">#{rank}</span>
                    <span className="text-xl text-gray-500">- - - - - -</span>
                    <span className="text-2xl font-black text-[#00d9ff]">000000</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pixelated Border Bottom */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#ec4899] to-transparent" />

      <Footer />
    </div>
  );
}
