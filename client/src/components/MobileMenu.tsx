"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
    { label: "Community", href: "/community" },
    { label: "Store", href: "/shop" },
    { label: "FAQ", href: "/faq" },
    { label: "Socials", href: "/socials" },
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
            onClick={onClose}
          />

          {/* White panel - BELOW navbar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-20 bottom-0 w-full max-w-md bg-white z-[1000] overflow-y-auto shadow-2xl"
          >
            {/* Menu content */}
            <div className="px-6 py-8">
              {/* Connect Wallet */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <ConnectButton />
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col gap-0">
                {links.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.15 }}
                    className="group flex items-center justify-between py-4 text-xl font-bold text-black uppercase tracking-tight hover:text-gray-600 transition-colors border-b border-gray-100"
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-400 text-2xl transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">License</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Terms & Conditions</p>
                <p className="text-xs text-gray-500 mb-1">SHACKO LABS, INC © 2026</p>
                <p className="text-xs text-gray-500 mb-1">MADE WITH ❤️ ON BASE</p>
                <p className="text-xs text-gray-500">HELLO@SHACKO.XYZ</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
