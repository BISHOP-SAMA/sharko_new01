"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

// Import your images
import heroImage from "@assets/New1.png";
import aboutImage from "@assets/New3.png";
import stakingImage from "@assets/New03.png";
import raffleImage from "@assets/New2.png";

// Generate paths for gallery grid (1.jpg to 30.jpg)
const galleryImages = Array.from({ length: 30 }, (_, i) => `/assets/${i + 1}.jpg`);

// Team data
const team = [
  {
    name: "BISHOP",
    role: "Product Manager",
    image: "/assets/Bishop.jpg",
    traits: ["Jack of all trades", "Works without break", "Part time degen"],
  },
  {
    name: "ALLWELL",
    role: "Developer",
    image: "/assets/Allwell.jpg",
    traits: [
      "He's the small voice you hear in your head sometimes",
      "Always pitching ideas somewhere to someone",
      "Fast learner",
    ],
  },
  {
    name: "KAGE",
    role: "CM",
    image: "/assets/Kage.jpg",
    traits: [
      "Loses money everyday trading",
      "Collaborative learner",
      "The missing piece your project needs",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Header />

      {/* HERO SECTION - THE DEEP */}
      <section className="relative pt-40 pb-0 px-6 bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1729] overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* THE DEEP Title */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[18vw] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] via-[#0ea5e9] to-[#7dd3fc] leading-none mb-8"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              WebkitTextStroke: "2px rgba(0, 217, 255, 0.3)",
            }}
          >
            THE DEEP
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 font-semibold max-w-4xl mx-auto mb-16 leading-relaxed px-4"
          >
            888 unique 2D sharks, meticulously designed with bold personalities and rare traits.
            Shacko merges art, community, and culture into a thriving world of fins, mischief, and ocean vibes.
          </motion.p>

          {/* Hero Image - Positioned at bottom of section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#00d9ff] blur-[120px] opacity-20 rounded-full" />
            <img
              src={heroImage}
              alt="Shacko Head"
              className="relative w-full max-w-5xl mx-auto h-auto drop-shadow-[0_0_80px_rgba(0,217,255,0.4)]"
              style={{ marginBottom: "-1px" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ABOUT SHACKO SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a1f3a] to-[#2d1b4e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#f97316] mb-8"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                ABOUT SHACKO
              </h2>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p className="font-medium">
                  Shacko is a Web3-native brand and digital ecosystem built around a collection of 888 sharks
                  emerging from the depths of the digital ocean. More than just an NFT collection, Shacko
                  represents a growing platform where community, culture, and interactive experiences converge.
                </p>

                <p className="font-medium">
                  At its core, Shacko is about strategy, resilience, and opportunity. Much like sharks
                  navigating the unpredictable currents of the ocean, the Shacko community thrives in the
                  dynamic environment of Web3 by embracing innovation, collaboration, and calculated risk.
                </p>
              </div>

              {/* CTA Button */}
              <a href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 group flex items-center gap-3 bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.7)] transition-all"
                >
                  Discover More
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ec4899] to-[#f97316] blur-[100px] opacity-30 rounded-full" />
              <img
                src={aboutImage}
                alt="About Shacko"
                className="relative w-full h-auto rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHACKO RAFFLE SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2d1b4e] to-[#1a3a52]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] blur-[100px] opacity-30 rounded-full" />
              <img
                src={raffleImage}
                alt="Shacko Raffle"
                className="relative w-full h-auto rounded-3xl shadow-2xl"
              />
            </motion.div>

            {/* Right - Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <h2
                className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] mb-8"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                SHACKO RAFFLE
              </h2>

              <p className="text-gray-300 text-xl font-medium mb-8 leading-relaxed">
                Enter raffles using xSHACK to win epic prizes! From rare NFTs to exclusive perks,
                the raffle system brings excitement and rewards to the Shacko community.
              </p>

              {/* CTA Button */}
              <a href="/raffle">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_rgba(139,92,246,0.7)] transition-all"
                >
                  Enter Raffles
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHACKO STAKING SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#1a3a52] to-[#0f1729]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] mb-8"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                SHACKO STAKING
              </h2>

              <p className="text-gray-300 text-xl font-medium mb-8 leading-relaxed">
                Stake your Shacko NFTs to earn $xSHACK rewards. The longer you stake, the more you earn.
              </p>

              {/* CTA Button */}
              <a href="/staking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:shadow-[0_0_50px_rgba(251,191,36,0.7)] transition-all"
                >
                  Start Staking
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] blur-[100px] opacity-30 rounded-full" />
              <img
                src={stakingImage}
                alt="Shacko Staking"
                className="relative w-full h-auto rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHACKO SHOP SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0f1729] to-[#0a0e27]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#14b8a6] mb-12"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            SHACKO SHOP
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Explore", },
              { title: "Create", },
              { title: "Collect", },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-[#10b981]/30 rounded-3xl p-8 hover:border-[#10b981] transition-all"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 mx-auto bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] transition-all"
          >
            Coming Soon
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </section>

      {/* SHACKO - GALLERY GRID */}
      <section className="py-32 px-6 bg-[#0a0e27] overflow-hidden">
        <div className="max-w-7xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] mb-8 text-center"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            SHACKO HUB
          </motion.h2>

          {/* View All Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 mx-auto bg-gradient-to-r from-[#00d9ff] to-[#0ea5e9] text-black px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(0,217,255,0.5)] hover:shadow-[0_0_50px_rgba(0,217,255,0.7)] transition-all"
            >
              VIEW ALL COLLECTION
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* Scrolling Gallery Grid - Azuki Style */}
        <div className="space-y-6">
          {/* Row 1 - Left to Right */}
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: [0, -2000] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 flex-shrink-0"
            >
              {[...galleryImages.slice(0, 8), ...galleryImages.slice(0, 8)].map((src, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer flex-shrink-0"
                  style={{ width: "280px", height: "280px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff] to-[#ec4899] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  <img
                    src={src}
                    alt={`Shacko ${i + 1}`}
                    className="w-full h-full object-cover rounded-2xl border-2 border-[#2a3f5f] group-hover:border-[#00d9ff] transition-all shadow-xl"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 - Right to Left */}
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: [-2000, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 flex-shrink-0"
            >
              {[...galleryImages.slice(8, 16), ...galleryImages.slice(8, 16)].map((src, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer flex-shrink-0"
                  style={{ width: "280px", height: "280px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff] to-[#ec4899] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  <img
                    src={src}
                    alt={`Shacko ${i + 9}`}
                    className="w-full h-full object-cover rounded-2xl border-2 border-[#2a3f5f] group-hover:border-[#00d9ff] transition-all shadow-xl"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 3 - Left to Right */}
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: [0, -2000] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 flex-shrink-0"
            >
              {[...galleryImages.slice(16, 24), ...galleryImages.slice(16, 24)].map((src, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer flex-shrink-0"
                  style={{ width: "280px", height: "280px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff] to-[#ec4899] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  <img
                    src={src}
                    alt={`Shacko ${i + 17}`}
                    className="w-full h-full object-cover rounded-2xl border-2 border-[#2a3f5f] group-hover:border-[#00d9ff] transition-all shadow-xl"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 4 - Right to Left */}
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: [-2000, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 flex-shrink-0"
            >
              {[...galleryImages.slice(24, 30), ...galleryImages.slice(0, 2), ...galleryImages.slice(24, 30), ...galleryImages.slice(0, 2)].map((src, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer flex-shrink-0"
                  style={{ width: "280px", height: "280px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff] to-[#ec4899] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  <img
                    src={src}
                    alt={`Shacko ${i + 25}`}
                    className="w-full h-full object-cover rounded-2xl border-2 border-[#2a3f5f] group-hover:border-[#00d9ff] transition-all shadow-xl"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHACKO EXPERIENCES - Theatre, Pump, Staking */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0e27] to-[#2d1b4e]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-7xl md:text-9xl font-black text-white mb-16 text-center"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            EXPERIENCES
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shacko Theatre */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-[#ec4899] to-[#f97316] rounded-3xl p-8 hover:scale-105 transition-transform cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
              <div className="relative z-10">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-4xl font-black text-white mb-4">SHACKO THEATRE</h3>
                <p className="text-white/90 font-medium">Immersive storytelling and animated lore</p>
                <div className="mt-6 inline-block bg-black/30 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold text-sm">
                  COMING SOON
                </div>
              </div>
            </motion.div>

            {/* Shacko Pump */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative bg-gradient-to-br from-[#10b981] to-[#14b8a6] rounded-3xl p-8 hover:scale-105 transition-transform cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
              <div className="relative z-10">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-4xl font-black text-white mb-4">SHACKO PUMP</h3>
                <p className="text-white/90 font-medium">Trade, compete, and ride the waves</p>
                <div className="mt-6 inline-block bg-black/30 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold text-sm">
                  COMING SOON
                </div>
              </div>
            </motion.div>

            {/* Staking - LIVE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-3xl p-8 hover:scale-105 transition-transform cursor-pointer overflow-hidden"
            >
              <a href="/staking" className="block">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                <div className="relative z-10">
                  <div className="text-6xl mb-4"></div>
                  <h3 className="text-4xl font-black text-black mb-4">STAKING</h3>
                  <p className="text-black/90 font-medium">Earn rewards by staking your Shackos</p>
                  <div className="mt-6 flex items-center gap-2 text-black font-black">
                    <span>STAKE NOW</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2d1b4e] to-[#0f1729]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#ec4899] mb-16 text-center"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            MEET THE CREW
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-gradient-to-br from-[#1a3a52] to-[#0f1729] border-2 border-[#2a3f5f] rounded-3xl p-8 hover:border-[#00d9ff] transition-all group"
              >
                <div className="aspect-square rounded-2xl border-2 border-[#2a3f5f] group-hover:border-[#00d9ff] overflow-hidden mb-6 transition-all">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-4xl font-black text-[#00d9ff] mb-1">{member.name}</h3>
                <p className="text-xl font-bold text-[#ec4899] mb-4 uppercase">{member.role}</p>
                <ul className="space-y-2">
                  {member.traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium text-gray-400">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#00d9ff] shrink-0" />
                      {trait}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
