"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, ShoppingBag, Package, Shirt, Image, Gift } from "lucide-react";
import { useState } from "react";

export default function Shop() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const shopItems = [
    {
      icon: Shirt,
      title: "Exclusive Merch",
      desc: "Hoodies, tees, hats, and accessories featuring your favorite sharks",
      gradient: "from-[#0ea5e9] to-[#38bdf8]",
    },
    {
      icon: Image,
      title: "Digital Drops",
      desc: "Limited edition wallpapers, PFPs, and animated shark content",
      gradient: "from-[#ec4899] to-[#f97316]",
    },
    {
      icon: Gift,
      title: "Real-World Perks",
      desc: "Physical collectibles, event access, and exclusive partner collabs",
      gradient: "from-[#10b981] to-[#14b8a6]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden">
      <Header />

      {/* Coming Soon Hero */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#10b981]/20 to-[#14b8a6]/20 backdrop-blur-sm px-8 py-4 rounded-full mb-8 border-2 border-[#10b981]/30"
          >
            <ShoppingBag className="w-8 h-8 text-[#10b981]" />
            <span className="text-2xl font-black text-[#10b981]" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
              SHACKO SHOP
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[15vw] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#14b8a6] leading-none mb-8"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              WebkitTextStroke: "2px rgba(16, 185, 129, 0.3)",
            }}
          >
            COMING SOON
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-gray-300 font-bold mb-12 max-w-4xl mx-auto"
          >
            The SHACKO Shop is getting ready to drop exclusive merch, digital collectibles, and real-world perks
          </motion.p>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-lg mx-auto"
          >
            {submitted ? (
              <div className="bg-gradient-to-br from-[#10b981] to-[#14b8a6] backdrop-blur-md border-4 border-black rounded-3xl p-10 text-center shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border-4 border-white/40">
                  <Mail size={40} className="text-white" />
                </div>
                <h3
                  className="text-4xl font-black text-white mb-4"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  You're on the List!
                </h3>
                <p className="text-xl text-white/90 font-semibold">
                  We'll notify you the second the shop launches. Get ready!
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-4 border-black rounded-3xl p-8 shadow-2xl">
                <h3
                  className="text-3xl font-black text-white mb-6 text-center"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  Get Notified at Launch
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 h-16 px-6 rounded-xl border-4 border-[#10b981] bg-black/60 text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#10b981]/50 font-bold text-lg"
                  />
                  <button
                    type="submit"
                    className="h-16 px-10 bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-black text-xl rounded-xl border-4 border-black hover:scale-105 transition-all shadow-lg"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    Notify Me
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What's Coming */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black text-white text-center mb-16"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            WHAT'S COMING
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shopItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`bg-gradient-to-br ${item.gradient} border-4 border-black rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform`}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center mx-auto mb-6">
                    <Icon size={40} className="text-white" />
                  </div>
                  <h3
                    className="text-4xl font-black text-white text-center mb-4"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-lg text-white/90 text-center font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2d1b4e] to-[#0a0e27]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-4 border-black rounded-3xl p-12 shadow-2xl"
          >
            <h2
              className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-center mb-12"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              Shop Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Exclusive Drops", desc: "Limited edition items you can't get anywhere else" },
                { title: "Holder Benefits", desc: "Special discounts and early access for NFT holders" },
                { title: "Quality Merch", desc: "Premium materials and designs that actually look good" },
                { title: "Global Shipping", desc: "We'll ship sharks to your door, wherever you are" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl p-6 hover:border-[#10b981] transition-all"
                >
                  <h3 className="text-2xl font-black text-[#10b981] mb-3">{feature.title}</h3>
                  <p className="text-gray-300 font-semibold">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#10b981] to-[#14b8a6] blur-3xl opacity-30 rounded-3xl" />
            
            <div className="relative bg-gradient-to-br from-[#10b981] to-[#14b8a6] border-4 border-black rounded-3xl p-12 shadow-2xl">
              <Package size={64} className="text-white mx-auto mb-6" />
              <h2
                className="text-5xl md:text-7xl font-black text-white mb-6"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                SHOP LAUNCHING SOON
              </h2>
              <p className="text-2xl text-white/90 font-bold mb-8 max-w-2xl mx-auto">
                Sign up above to be first in line when we open the doors
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40">
                  <span className="text-white font-black text-lg">Exclusive Merch</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40">
                  <span className="text-white font-black text-lg">Digital Collectibles</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40">
                  <span className="text-white font-black text-lg">Real-World Perks</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
