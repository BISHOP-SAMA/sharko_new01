"use client";

import { Link } from "wouter"; // Fixed lowercase 'import'
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Raffles", path: "/raffle" },
  { name: "Staking", path: "/staking" },
  { name: "Arcade", path: "/arcade" },
  { name: "Shop", path: "/shop" },
  { name: "Theatre", path: "/theatre" },
  { name: "Lore", path: "/lore" },
  { name: "About", path: "/about" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[200] bg-[#0a0e27]/95 backdrop-blur-xl flex flex-col p-8"
        >
          {/* Top Bar inside Menu */}
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-[Bangers] text-[#00d9ff] tracking-widest">MENU</span>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl border-2 border-[#ec4899]/50 bg-[#ec4899]/10 text-[#ec4899] hover:bg-[#ec4899] hover:text-white transition-all"
            >
              <X size={28} strokeWidth={3} />
            </button>
          </div>

          {/* Links Grid */}
          <nav className="flex flex-col gap-2 overflow-y-auto">
            {menuLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={link.path}>
                  <a 
                    onClick={onClose}
                    className="group flex items-center justify-between text-5xl font-[Bangers] text-white py-3 hover:text-[#00d9ff] transition-all border-b border-white/5"
                  >
                    <span>{link.name}</span>
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity text-[#00d9ff]">DIVE →</span>
                  </a>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Wallet Section at Bottom */}
          <div className="mt-auto pt-8 flex flex-col items-center gap-4">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />
            <p className="text-[#00d9ff] font-bold text-xs tracking-widest uppercase mb-2">Connect to the Deep</p>
            <div className="scale-110">
              <ConnectButton label="Connect Wallet" showBalance={false} chainStatus="icon" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
