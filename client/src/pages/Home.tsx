import { GalleryGrid } from "@/components/GalleryGrid";
import { FloatingSharks } from "@/components/FloatingSharks";
import { MobileMenu } from "@/components/MobileMenu";
import { Footer } from "@/components/Footer";  // ← Add this import
import { motion, AnimatePresence } from "framer-motion";
import { ComicButton } from "@/components/ui/comic-button";
import { SiX, SiDiscord } from "react-icons/si";
import { useState } from "react";
import confetti from "canvas-confetti";
import logoImage from "@assets/logo-shark.png";
import heroImage from "@assets/hero-shark.png";
import backShackoImage from "@assets/back-shacko.png";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState<null | 'OG' | 'GTD' | 'BOTH' | 'NONE'>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const scrollToVibes = () => {
    document.getElementById('vibes')?.scrollIntoView({ behavior: 'smooth' });
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0ea5e9', '#38bdf8', '#ec4899', '#fbbf24']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0ea5e9', '#38bdf8', '#ec4899', '#fbbf24']
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
    
    if (!wallet.startsWith('0x') || wallet.length !== 42) {
      setError("Invalid wallet address format");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/check-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setStatus(data.status);
        
        if (data.status !== 'NONE') {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      <FloatingSharks />
      
      {/* Success Modal */}
      <AnimatePresence>
        {showModal && status && status !== 'NONE' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl border-4 border-black comic-shadow-lg max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black text-white font-bold hover:bg-gray-800"
              >
                ✕
              </button>

              <div className="flex justify-center mb-6">
                <img 
                  src={backShackoImage} 
                  alt="Success Sharks" 
                  className="w-48 h-48 object-contain"
                />
              </div>

              <h2 className="text-5xl font-[Bangers] text-center text-[#0ea5e9] mb-4 text-stroke-sm">
                🎉 YOU'RE IN! 🎉
              </h2>

              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {(status === 'OG' || status === 'BOTH') && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-xl font-[Bangers] text-2xl border-3 border-black comic-shadow"
                  >
                    👑 OG PHASE
                  </motion.div>
                )}
                {(status === 'GTD' || status === 'BOTH') && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: status === 'BOTH' ? 0.4 : 0.2, type: "spring" }}
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 text-black px-6 py-3 rounded-xl font-[Bangers] text-2xl border-3 border-black comic-shadow"
                  >
                    💎 GTD PHASE
                  </motion.div>
                )}
              </div>

              <p className="text-center text-gray-600 font-[Fredoka] text-lg mb-6">
                You're officially on the Shark List! Get ready to chomp! 🦈
              </p>

              <ComicButton 
                onClick={() => setShowModal(false)}
                className="w-full"
                size="lg"
              >
                AWESOME!
              </ComicButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
            <span className="text-3xl font-[Bangers] text-white text-stroke tracking-widest">
              SHACKO
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-8 px-6 min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10 mb-4"
        >
          <h1 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-[Bangers] text-white leading-[0.85] tracking-tight">
            <span className="block text-stroke">CHOMP.</span>
            <span className="block text-stroke">COLLECT.</span>
            <span className="block text-[#1e3a5f] text-stroke">SHACKO.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 w-full max-w-4xl mx-auto"
        >
          <img
            src={heroImage}
            alt="Shacko Characters"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        <motion.div 
          className="mt-8 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ComicButton size="lg" onClick={scrollToVibes}>
            Explore the Ocean
          </ComicButton>
        </motion.div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-[#1e293b] border-y-4 border-black py-4 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-3xl font-[Bangers] text-white mx-8">
              THE CHOMP NEVER ENDS <span className="text-[#38bdf8]">SHACKO</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Wallet Check Section */}
      <section id="whitelist-checker" className="relative py-32 bg-[#0ea5e9] border-y-4 border-black overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }} 
        />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="bg-white border-4 border-black rounded-3xl p-10 comic-shadow text-center"
          >
            <h2 className="text-6xl font-[Bangers] text-[#0ea5e9] text-stroke mb-4 uppercase">CHECK THE LIST</h2>
            <p className="text-xl font-bold mb-8 text-slate-700">Are you an OG or a GTD shark? Paste your wallet below!</p>
            
            <div className="space-y-4">
              <input 
                type="text" 
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..." 
                className="w-full h-16 rounded-xl border-4 border-black px-6 text-xl font-mono focus:ring-4 focus:ring-[#ec4899]/30 outline-none transition-all"
              />
              
              {error && (
                <p className="text-red-500 font-bold">{error}</p>
              )}
              
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
            
            {status === 'NONE' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-2xl border-4 border-black bg-red-50"
              >
                <p className="font-[Bangers] text-4xl text-slate-400">NOT ON LIST YET... 💨</p>
                <p className="text-gray-600 mt-2">Keep swimming! Future opportunities await.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <div id="vibes">
        <GalleryGrid />
      </div>

      <Footer />  {/* ← Replace the old footer with just this */}
    </div>
  );
        }
