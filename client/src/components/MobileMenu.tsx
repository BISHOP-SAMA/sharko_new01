import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { X, Menu } from "lucide-react";
import { SiX, SiDiscord } from "react-icons/si";
import logoImage from "@assets/logo-shark.png";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-7 h-7 text-white" />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />

            {/* Menu Panel - starts from top, covers entire left side */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] z-[100] flex flex-col shadow-2xl"
            >
              {/* Header with Logo and Close */}
              <div className="flex items-center justify-between p-6 border-b-2 border-white/20">
                <div className="flex items-center gap-2">
                  <img src={logoImage} alt="Shacko" className="w-10 h-10" />
                  <span className="text-2xl font-[Bangers] text-white">SHACKO</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-6 py-8">
                <Link href="/">
                  <a
                    onClick={() => setIsOpen(false)}
                    className="block py-4 text-2xl font-[Fredoka] font-medium text-white hover:text-[#fbbf24] transition-colors border-b border-white/10"
                  >
                    home
                  </a>
                </Link>

                <Link href="/staking">
                  <a
                    onClick={() => setIsOpen(false)}
                    className="block py-4 text-2xl font-[Fredoka] font-medium text-white hover:text-[#fbbf24] transition-colors border-b border-white/10"
                  >
                    staking
                  </a>
                </Link>

                <Link href="/rewards">
                  <a
                    onClick={() => setIsOpen(false)}
                    className="block py-4 text-2xl font-[Fredoka] font-medium text-white hover:text-[#fbbf24] transition-colors border-b border-white/10"
                  >
                    rewards
                  </a>
                </Link>

                <Link href="/about">
                  <a
                    onClick={() => setIsOpen(false)}
                    className="block py-4 text-2xl font-[Fredoka] font-medium text-white hover:text-[#fbbf24] transition-colors border-b border-white/10"
                  >
                    about us
                  </a>
                </Link>

                <Link href="/faq">
                  <a
                    onClick={() => setIsOpen(false)}
                    className="block py-4 text-2xl font-[Fredoka] font-medium text-white hover:text-[#fbbf24] transition-colors border-b border-white/10"
                  >
                    faq
                  </a>
                </Link>
              </nav>

              {/* Social Footer - Like "Log in" position in Napo */}
              <div className="p-6 border-t-2 border-white/20">
                <div className="flex items-center justify-center gap-6">
                  <a
                    href="https://x.com/Sharksonbase_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 border-2 border-white/20"
                    aria-label="Twitter"
                  >
                    <SiX className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="https://discord.gg/dfxMGDTnpM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 border-2 border-white/20"
                    aria-label="Discord"
                  >
                    <SiDiscord className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
