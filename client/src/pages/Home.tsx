"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import heroImage from "@assets/hero-shark.png";
import bishopImage from "@assets/Bishop.jpg";
import allwellImage from "@assets/Allwell.jpg";
import kageImage from "@assets/Kage.jpg";
import confetti from "canvas-confetti";
import { ComicButton } from "@/components/ui/comic-button";

// Team data
const team = [
  {
    name: "BISHOP",
    role: "Product Manager",
    image: bishopImage,
    traits: ["Jack of all trades", "Works without break", "Part time degen"],
  },
  {
    name: "Allwell",
    role: "Developer",
    image: allwellImage,
    traits: [
      "He's the small voice you hear in your head sometimes",
      "Always pitching ideas somewhere to someone",
      "Fast learner",
    ],
  },
  {
    name: "KAGE",
    role: "CM",
    image: kageImage,
    traits: [
      "Loses money everyday trading",
      "Collaborative learner",
      "The missing piece your project needs",
    ],
  },
];

type WhitelistStatus = "OG" | "GTD" | "WL" | "OG+GTD" | "OG+WL" | "GTD+WL" | "ALL" | "NONE";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState<WhitelistStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#0ea5e9", "#38bdf8", "#ec4899", "#fbbf24"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#0ea5e9", "#38bdf8", "#ec4899", "#fbbf24"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const checkWhitelist = async () => {
    setError("");
    setStatus(null);
    setShowModal(false);

    if (!wallet.startsWith("0x") || wallet.length !== 42) {
      setError("Invalid wallet address format");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/check-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setStatus(data.status);

        if (data.status !== "NONE") {
          setShowModal(true);
          fireConfetti();
        }
      }
    } catch (err) {
      setError("Failed to check wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shouldShowBadge = (badge: "OG" | "GTD" | "WL") => {
    if (!status || status === "NONE") return false;
    if (status === "ALL") return true;
    if (badge === "OG") return status === "OG" || status.includes("OG");
    if (badge === "GTD") return status === "GTD" || status.includes("GTD");
    if (badge === "WL") return status === "WL" || status.includes("WL");
    return false;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Marquee Banner - "$PENGU NOW LIVE" style */}
      <div className="fixed top-20 left-0 right-0 bg-[#1e293b] py-3 z-40 overflow-hidden border-b-4 border-black">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-2xl font-bold text-white mx-8">
              $SHACKO COMING SOON <span className="text-[#0ea5e9]">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero Section - "THE HUDDLE" style */}
      <section className="relative pt-40 pb-20 px-6 bg-gradient-to-b from-[#0ea5e9] to-[#38bdf8] overflow-hidden">
        {/* Animated snow/particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-60"
              initial={{ y: -20, x: Math.random() * window.innerWidth }}
              animate={{
                y: window.innerHeight + 20,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* THE DEEP - Big title */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[15vw] md:text-[180px] font-black text-white leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              letterSpacing: "0.05em",
              textShadow: "4px 4px 0px rgba(0,0,0,0.2)",
            }}
          >
            THE DEEP
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-white font-bold max-w-3xl mx-auto mb-12 uppercase tracking-wide"
          >
            SHACKO IS A GLOBAL IP FOCUSED ON PROLIFERATING THE SHARK, MEMETIC CULTURE, AND GOOD VIBES.
          </motion.p>

          {/* Hero Sharks Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <img
              src={heroImage}
              alt="Shacko Characters"
              className="w-full max-w-4xl mx-auto h-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* About SHACKO - Pink Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b]">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-7xl md:text-9xl font-black text-white mb-12 text-center"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            SHACKO
          </h2>

          <div className="space-y-8 text-white text-xl md:text-2xl font-semibold leading-relaxed">
            <p>
              WELCOME TO THE WORLD OF SHACKO. A WEB3-BORN BRAND THAT FOSTERS CREATIVITY, FREEDOM, AND COMMUNITY.
            </p>

            <p>
              THE SHACKO BRAND PRODUCES CONTENT, MERCHANDISE, TOYS, AND DIGITAL COLLECTABLES. WE BELIEVE IN THE POWER OF PLAY AND IMAGINATION, AND WE'RE COMMITTED TO HELPING YOU UNLOCK YOUR INNER SHARK.
            </p>

            <p>
              IT'S A VERY DEEP OCEAN BUT YOU'LL BE SAFE WITH YOUR NEW FAVORITE SHARK FAMILY!
            </p>
          </div>
        </div>
      </section>

      {/* The Shacko Prophecy - Beige Section */}
      <section className="py-32 px-6 bg-[#fef3c7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-7xl md:text-9xl font-black text-black mb-8"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            THE SHACKO PROPHECY
          </h2>

          <p className="text-2xl font-bold text-black mb-12 uppercase">
            LEARN ABOUT THE SHACKO LORE
          </p>

          <button className="group flex items-center gap-4 mx-auto bg-white border-4 border-black rounded-full px-12 py-6 hover:bg-gray-50 transition-all shadow-lg">
            <span className="text-3xl">↗</span>
            <span className="text-3xl font-black uppercase">Discover</span>
          </button>

          {/* Placeholder shark character */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rounded-3xl flex items-center justify-center border-4 border-black shadow-xl">
              <span className="text-9xl">🦈</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shop Section - Pink Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b]">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-7xl md:text-9xl font-black text-white mb-8"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            SHOP MERCH & COLLECTIBLES
          </h2>

          <p className="text-2xl font-bold text-white mb-12 uppercase">
            START YOUR COLLECTION TODAY!
          </p>

          <button className="group flex items-center gap-4 mx-auto bg-black text-white border-4 border-white rounded-full px-12 py-6 hover:bg-gray-900 transition-all shadow-lg">
            <span className="text-3xl">↗</span>
            <span className="text-3xl font-black uppercase">Shop Now</span>
          </button>

          {/* Placeholder merch display */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="w-64 h-64 mx-auto bg-white rounded-3xl flex items-center justify-center border-4 border-black shadow-xl">
              <span className="text-9xl">👕</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Section - Blue Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0ea5e9] to-[#38bdf8]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-7xl md:text-9xl font-black text-white text-center mb-20"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
          >
            BABY SHACKOS
          </h2>

          <p className="text-2xl md:text-3xl text-white font-bold text-center max-w-4xl mx-auto leading-relaxed uppercase mb-12">
            BABY SHACKOS ARE 888 SHACKOS OF OCEAN DESCENT. BABY SHACKOS ARE CUTE AND ADORABLE BUT DON'T LET THEIR LOOKS FOOL YOU. THEY ARE FIERCE, MIGHTY, AND ARE ALLIES IN THE FIGHT AGAINST THE EVIL BEARS OF NEGATIVITY.
          </p>

          {/* Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white border-4 border-black rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-transform"
              >
                <div className="aspect-square rounded-2xl border-4 border-black overflow-hidden mb-6">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-4xl font-black text-[#0ea5e9] mb-1">{member.name}</h3>
                <p className="text-xl font-bold text-[#ec4899] mb-4 uppercase">{member.role}</p>
                <ul className="space-y-2">
                  {member.traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-2 font-bold text-slate-700">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-black shrink-0" />
                      {trait}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Whitelist Checker - Clean White Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] border-4 border-black rounded-3xl p-10 shadow-2xl text-center"
          >
            <h2 className="text-6xl font-black text-white mb-4 uppercase">
              CHECK THE LIST
            </h2>
            <p className="text-xl font-bold mb-8 text-white">
              Are you OG, GTD, or WL? Paste your wallet below!
            </p>

            <div className="space-y-4">
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className="w-full h-16 rounded-xl border-4 border-black px-6 text-xl font-mono focus:ring-4 focus:ring-[#ec4899]/30 outline-none transition-all"
              />

              {error && <p className="text-red-500 font-bold">{error}</p>}

              <ComicButton
                size="lg"
                variant="accent"
                className="w-full"
                onClick={checkWhitelist}
                disabled={loading}
              >
                {loading ? "CHECKING..." : "Verify Status"}
              </ComicButton>
            </div>

            {status === "NONE" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-2xl border-4 border-black bg-red-50"
              >
                <p className="font-black text-4xl text-slate-400">NOT ON LIST YET... 💨</p>
                <p className="text-gray-600 mt-2">Keep swimming! Future opportunities await.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
