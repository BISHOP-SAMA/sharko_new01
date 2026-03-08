"use client";

import { motion } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import { Footer } from "@/components/Footer";
import logoImage from "@assets/logo-shark.png";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
              <span className="text-3xl font-[Bangers] text-white text-stroke tracking-widest">
                SHACKO
              </span>
            </a>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about">
              <a className="font-[Bangers] text-xl text-white hover:text-[#ec4899] transition-colors">About</a>
            </Link>
            <Link href="/staking">
              <a className="font-[Bangers] text-xl text-white hover:text-[#ec4899] transition-colors">Staking</a>
            </Link>
            <Link href="/">
              <a className="font-[Bangers] text-xl text-white hover:text-[#ec4899] transition-colors">Home</a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero / Intro */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-9xl font-[Bangers] text-white text-stroke mb-8"
          >
            ABOUT SHACKO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl font-bold text-slate-800 mb-12 leading-relaxed"
          >
            CHOMP. COLLECT. SHACKO.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border-4 border-black rounded-3xl p-10 comic-shadow max-w-4xl mx-auto"
          >
            <p className="text-lg md:text-2xl text-slate-800 font-medium leading-relaxed mb-8">
              SHACKO is more than just a collection — it's a movement. A pack of wild, fun-loving sharks that live for the chomp, the thrill, and the community. We’re building the most entertaining, rewarding, and chaotic corner of the ocean on Base.
            </p>

            <p className="text-lg md:text-2xl text-slate-800 font-medium leading-relaxed mb-8">
              From staking to raffles, from the Theatre to the Pump — every part of SHACKO is designed to make you laugh, earn, and feel part of something bigger. We’re not here to be boring. We’re here to chomp through the meta and make waves.
            </p>

            <p className="text-lg md:text-2xl text-slate-800 font-medium leading-relaxed">
              Join the school. Feed the sharks. Own the ocean. <br />
              <span className="text-[#ec4899] font-bold">CHOMP ON.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Features Grid */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "The Pack",
              desc: "Thousands of unique sharks with crazy traits, accessories, and personalities. Collect your favorites and show them off.",
            },
            {
              title: "Utility That Bites",
              desc: "Staking rewards, raffles, exclusive drops, Theatre events, and more. Owning a SHACKO means real perks in the ocean.",
            },
            {
              title: "Community First",
              desc: "Built on Base, powered by degens, fueled by memes. The squad is loud, fun, and always ready to chomp together.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white border-4 border-black rounded-3xl p-8 comic-shadow text-center"
            >
              <h3 className="text-4xl font-[Bangers] text-[#0ea5e9] mb-6">{item.title}</h3>
              <p className="text-lg text-slate-800">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}