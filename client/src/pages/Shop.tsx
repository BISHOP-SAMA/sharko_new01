"use client";

import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import MobileMenu from "@/components/MobileMenu"; // default import
import { Footer } from "@/components/Footer";
import { Mail, X, Globe } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/logo-shark.png";

export default function Shop() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: connect to real newsletter service (Mailchimp, etc.)
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] text-white overflow-x-hidden">
      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <span className="text-4xl font-bold tracking-tight text-white">SHACKO</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-white hover:text-[#ec4899] transition-colors font-medium">
              Home
            </a>
            <a href="/about" className="text-white hover:text-[#ec4899] transition-colors font-medium">
              About
            </a>
            <a href="/staking" className="text-white hover:text-[#ec4899] transition-colors font-medium">
              Staking
            </a>
            <a href="/shop" className="text-[#ec4899] font-bold">
              Shop
            </a>
          </div>
        </div>
      </nav>

      {/* Coming Soon Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20"
          >
            <span className="text-2xl">🦈</span>
            <span className="text-lg font-bold uppercase tracking-wider">Shop</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-[Bangers] text-white text-stroke mb-6 leading-tight"
          >
            COMING SOON
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto"
          >
            The SHACKO Shop is getting ready to drop the dopest merch, digital collectibles, exclusive drops, and maybe even real-world shark plushies.
          </motion.p>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-lg mx-auto"
          >
            {submitted ? (
              <div className="bg-white/20 backdrop-blur-md border-2 border-[#0ea5e9] rounded-2xl p-8 text-center">
                <h3 className="text-3xl font-[Bangers] text-white mb-4">You're in the school! 🦈</h3>
                <p className="text-lg text-white/90">
                  We'll notify you the second the shop launches. Get ready to chomp!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 h-14 px-6 rounded-xl border-4 border-black bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#ec4899]"
                />
                <button
                  type="submit"
                  className="h-14 px-10 bg-[#ec4899] text-white font-[Bangers] text-xl rounded-xl border-4 border-black hover:bg-[#ec4899]/90 hover:scale-105 transition-all"
                >
                  Notify Me
                </button>
              </form>
            )}
          </motion.div>

          {/* Social Teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-6"
          >
            <a
              href="https://discord.gg/dfxMGDTnpM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-white/20 hover:border-[#0ea5e9] transition-all"
            >
              <X className="w-6 h-6" />
              <span className="font-medium">Follow on X</span>
            </a>
            <a
              href="https://discord.gg/dfxMGDTnpM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-white/20 hover:border-[#5865F2] transition-all"
            >
              <Globe className="w-6 h-6" />
              <span className="font-medium">Join Discord</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Sneak Peek Teaser */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-[Bangers] text-white mb-12">
            What's Coming to the Shop?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Exclusive Merch",
                desc: "Hoodies, tees, hats, and plush sharks with rare traits",
              },
              {
                title: "Digital Drops",
                desc: "Limited edition wallpapers, PFPs, and animated shark clips",
              },
              {
                title: "Real-World Perks",
                desc: "Physical collectibles, events, and partner collabs",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 hover:border-[#ec4899] transition-all"
              >
                <h3 className="text-3xl font-[Bangers] text-[#0ea5e9] mb-4">{item.title}</h3>
                <p className="text-lg text-gray-200">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}