import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiDiscord, SiX } from "react-icons/si";
import { ConnectButton } from '@rainbow-me/rainbowkit'; // ← ADD THIS
import logoImage from "@assets/logo-shark.png";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "home", href: "/" },
    { name: "staking", href: "/staking" },
    { name: "rewards", href: "/rewards" },
    { name: "about us", href: "/about" },
    { name: "faq", href: "/faq" },
  ];

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] z-50 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-white/20">
                <div className="flex items-center gap-3">
                  <img src={logoImage} alt="Shacko" className="w-10 h-10" />
                  <span className="text-3xl font-[Bangers] text-white">SHACKO</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Wallet Connect */}
              <div className="px-6 py-4 border-b-2 border-white/20">
                <ConnectButton />
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 text-xl font-[Bangers] text-white hover:bg-white/20 rounded-xl transition-colors uppercase tracking-wider"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Social Icons */}
              <div className="p-6 border-t-2 border-white/20">
                <div className="flex gap-4 justify-center">
                  <a
                    href="https://twitter.com/shacko"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  >
                    <SiX size={24} className="text-white" />
                  </a>
                  <a
                    href="https://discord.gg/shacko"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  >
                    <SiDiscord size={24} className="text-white" />
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