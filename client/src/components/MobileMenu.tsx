"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// 1. CHANGE THIS IMPORT:
import { Link } from "react-router-dom"; 

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const links = [
    { label: "About", href: "/about" },
    { label: "Lore", href: "/lore" },
    { label: "Arcade", href: "/arcade" },
    { label: "Shacko Pump", href: "/shacko-pump" },
    { label: "Theatre", href: "/theatre" },
    { label: "Staking", href: "/staking" },
    { label: "Rewards", href: "/rewards" },
    { label: "Store", href: "/shop" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[40]"
            onClick={onClose}
          />

          {/* Menu Panel - Slides from behind Navbar (top-20) */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 right-0 top-20 bottom-0 bg-[#0ea5e9] z-[45] overflow-y-auto border-t-4 border-black flex flex-col"
          >
            <div className="p-6 flex flex-col h-full">
              
              {/* Wallet Section */}
              <div className="mb-8 p-4 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block w-fit">
                <ConnectButton accountStatus="address" showBalance={false} />
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-2">
                {links.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* 2. ENSURE THIS IS THE REACT ROUTER LINK */}
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="text-4xl font-black italic uppercase text-white hover:text-black transition-colors py-2 block drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-auto pt-10 border-t-4 border-black/20">
                <p className="text-black font-black italic uppercase text-lg mb-4">
                  THE CHOMP NEVER ENDS
                </p>
                <div className="text-[10px] font-bold text-white uppercase tracking-[0.2em] space-y-1 opacity-80">
                  <p>SHACKO LABS, INC © 2026</p>
                  <p>MADE ON BASE 🔵</p>
                  <p>HELLO@SHACKO.XYZ</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
