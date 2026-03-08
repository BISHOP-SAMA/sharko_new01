import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Trimmed & matched to your screenshots + project focus
  const menuItems = [
    { name: "ABOUT", href: "/about" },
    { name: "LORE", href: "/lore" },
    { name: "RAFFLES", href: "/raffles" },
    { name: "SHARK BANK", href: "/shark-bank" },
    { name: "SHACKO PUMP", href: "/shacko-pump" },
    { name: "THEATRE", href: "/theatre" },
    { name: "STAKING", href: "/staking" },
    { name: "REWARDS", href: "/rewards" },
    { name: "COMMUNITY", href: "/community" },
  ];

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={28} strokeWidth={2.5} />
      </button>

      {/* Full-Screen Overlay – Dark thematic bg */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-gradient-to-b from-[#001122] to-[#000814] z-[100] overflow-y-auto text-white"
          >
            {/* Fixed Header */}
            <div className="sticky top-0 bg-[#001122]/90 backdrop-blur-md z-10">
              <div className="flex items-center justify-between px-6 h-16 border-b border-blue-900/30">
                <span className="text-2xl font-black tracking-tight text-white">SHACKO</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={28} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content – More breathing room */}
            <div className="px-6 py-10">
              {/* Connect Wallet – Prominent, Azuki-like */}
              <div className="mb-10">
                <ConnectButton />
              </div>

              {/* Menu Items – Clean, uppercase, arrow right, more space */}
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-4 text-xl font-bold uppercase tracking-wide hover:text-blue-300 transition-colors border-b border-blue-900/40 last:border-b-0"
                    >
                      <span>{item.name}</span>
                      <span className="text-blue-500 text-2xl">→</span>
                    </a>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}