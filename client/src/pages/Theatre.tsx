"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import MobileMenu from "@/components/MobileMenu"; 
import { Footer } from "@/components/Footer";
import { Film, Clapperboard, Menu } from "lucide-react";
import logoImage from "@assets/logo-shark.png";

export default function Theatre() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
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
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden relative">
      {/* Curtain overlay effect */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70 z-10" />

      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0a0e27]/90 backdrop-blur-md border-b border-[#ec4899]/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Button for Mobile */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-white hover:text-[#ec4899] transition-colors focus:outline-none"
            >
              <Menu size={32} />
            </button>
            
            <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
            <span className="text-3xl font-[Bangers] text-white tracking-wider">SHACKO</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="hover:text-[#ec4899] transition-colors font-medium">HOME</a>
            <a href="/about" className="hover:text-[#ec4899] transition-colors font-medium">ABOUT</a>
            <a href="/staking" className="hover:text-[#ec4899] transition-colors font-medium">STAKING</a>
            <a href="/theatre" className="text-[#ec4899] font-bold">THEATRE</a>
          </div>
        </div>

        {/* Existing Mobile Menu Integration */}
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-16 px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-md px-8 py-4 rounded-full mb-8 border border-[#ec4899]/40"
          >
            <Clapperboard className="w-8 h-8 text-[#ec4899]" />
            <span className="text-2xl font-[Bangers] text-[#ec4899]">THEATRE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl md:text-9xl font-[Bangers] text-white mb-6 tracking-tight"
          >
            LIGHTS. CAMERA. <span className="text-[#ec4899]">CHOMP</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 uppercase tracking-widest font-light"
          >
            Where SHACKO stories come alive. Lore drops, animated shorts, and community chaos.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-[#ec4899] text-black px-12 py-6 rounded-2xl font-[Bangers] text-3xl border-4 border-black cursor-default shadow-[0_0_30px_rgba(236,72,153,0.3)]"
          >
            CURTAIN RISES SOON
          </motion.div>
        </div>
      </section>

      {/* Upcoming Shows */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-[Bangers] text-center text-white mb-16">
            COMING TO THE THEATRE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingShows.map((show, i) => (
              <motion.div
                key={show.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#ec4899]/50 transition-all group"
              >
                <div className="w-16 h-16 mb-6 rounded-2xl bg-[#ec4899]/10 flex items-center justify-center text-[#ec4899]">
                  <Film className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-[Bangers] text-white mb-2">{show.title}</h3>
                <p className="text-[#ec4899] text-sm font-bold tracking-widest mb-4 uppercase">{show.type}</p>
                <p className="text-gray-400 text-sm mb-4 font-mono">{show.date}</p>
                <p className="text-gray-300 leading-relaxed">{show.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 px-6 relative z-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-[Bangers] text-white mb-6">DON'T MISS THE PREMIERE</h2>
          <p className="text-gray-400 mb-10 text-lg">Get notified the moment the curtain rises on our first animated shorts.</p>

          {subscribed ? (
            <div className="bg-[#ec4899]/10 border border-[#ec4899] rounded-2xl p-8">
              <p className="text-[#ec4899] font-[Bangers] text-2xl">YOU'RE ON THE GUEST LIST! 🦈</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-[#ec4899] outline-none transition-all"
                required
              />
              <button className="bg-[#ec4899] text-black font-[Bangers] text-xl px-8 py-4 rounded-xl border-2 border-black hover:scale-105 transition-all">
                NOTIFY ME
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
