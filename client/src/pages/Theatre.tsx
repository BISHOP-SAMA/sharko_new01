"use client";

import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import MobileMenu from "@/components/MobileMenu"; // default import
import { Footer } from "@/components/Footer";
import { Film, Clapperboard, Ticket, PlayCircle } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/logo-shark.png";

export default function Theatre() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: connect to actual newsletter service later
      setSubscribed(true);
      setEmail("");
    }
  };

  const upcomingShows = [
    {
      title: "Shark Stories: Origin of the Chomp",
      type: "Lore Documentary",
      date: "Coming Q2 2026",
      desc: "Deep dive into how the SHACKO school was formed. Animated shorts + voice acting.",
    },
    {
      title: "Live Chomp Sessions",
      type: "Community Livestream",
      date: "Weekly starting soon",
      desc: "AMA with the squad, giveaways, meme battles, and live staking reveals.",
    },
    {
      title: "Pump Theatre Shorts",
      type: "Animated Series",
      date: "Episode 1 drops soon",
      desc: "Hilarious 60-second shark pump adventures. Pure chaos.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-x-hidden relative">
      {/* Curtain overlay effect */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70 z-10" />

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
            <a href="/theatre" className="text-[#0ea5e9] font-bold">Theatre</a>
          </div>
        </div>
      </nav>

      {/* Hero / Marquee */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-md px-8 py-4 rounded-full mb-8 border border-[#ec4899]/40"
          >
            <Clapperboard className="w-8 h-8 text-[#ec4899]" />
            <span className="text-2xl font-[Bangers] text-[#ec4899]">THEATRE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-9xl font-[Bangers] text-white mb-6 tracking-tight drop-shadow-2xl"
          >
            LIGHTS. CAMERA. <span className="text-[#ec4899]">CHOMP</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-4xl text-gray-300 max-w-4xl mx-auto mb-12"
          >
            Where SHACKO stories come alive. Lore drops, animated shorts, live events, and community chaos.
          </motion.p>

          {/* Coming Soon CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-block bg-[#ec4899] text-black px-12 py-6 rounded-2xl font-[Bangers] text-3xl border-4 border-black hover:scale-105 transition-transform shadow-2xl"
          >
            CURTAIN RISES SOON
          </motion.div>
        </div>
      </section>

      {/* Upcoming Shows */}
      <section className="py-16 px-6 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-[Bangers] text-center text-white mb-12">
            Coming to the Theatre
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingShows.map((show, i) => (
              <motion.div
                key={show.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
                className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-3xl p-8 border-2 border-[#ec4899]/30 hover:border-[#ec4899] transition-all group"
              >
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-black/40 text-[#ec4899] group-hover:scale-110 transition-transform">
                  <Film className="w-10 h-10" />
                </div>

                <h3 className="text-3xl font-[Bangers] text-center text-white mb-4">{show.title}</h3>
                <p className="text-center text-[#0ea5e9] font-bold mb-4">{show.type}</p>
                <p className="text-center text-gray-300 mb-4">{show.date}</p>
                <p className="text-center text-gray-200">{show.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-[Bangers] text-white mb-8"
          >
            Don't Miss the Premiere
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-10"
          >
            Get notified when the curtain rises. First look at trailers, drops, and live events.
          </motion.p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#ec4899]/20 border-2 border-[#ec4899] rounded-2xl p-10 text-center"
            >
              <h3 className="text-3xl font-[Bangers] text-white mb-4">You're on the guest list! 🦈</h3>
              <p className="text-lg text-gray-200">We'll send you the premiere invite soon.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 h-14 px-6 rounded-xl border-4 border-black bg-black/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec4899]"
              />
              <button
                type="submit"
                className="h-14 px-10 bg-[#ec4899] text-black font-[Bangers] text-xl rounded-xl border-4 border-black hover:bg-[#ec4899]/90 hover:scale-105 transition-all"
              >
                Get Notified
              </button>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}