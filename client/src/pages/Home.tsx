import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "About", href: "/about" },
    { name: "Lore", href: "/lore" },
    { name: "Arcade", href: "/arcade" },
    { name: "Shacko Pump", href: "/shacko-pump" },
    { name: "Theatre", href: "/theatre" },
    { name: "Staking", href: "/staking" },
    { name: "Rewards", href: "/rewards" },
    { name: "Community", href: "/community" },
    { name: "Store", href: "#shop" },
    { name: "FAQ", href: "/faq" },
    { name: "Socials", href: "#socials" },
  ];

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={28} strokeWidth={2.5} />
      </button>

      {/* Full-Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#e5e5e5] z-[100] overflow-y-auto"
          >
            {/* Fixed Header */}
            <div className="sticky top-0 bg-[#e5e5e5] z-10">
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-300">
                <span className="text-2xl font-bold tracking-tight text-black">SHACKO</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={28} strokeWidth={2.5} className="text-black" />
                </button>
              </div>
            </div>

            {/* Scrollable Menu Content */}
            <div className="px-6 py-6 pb-24">
              {/* Connect Wallet Button ONLY - No text */}
              <div className="mb-8 pb-6 border-b border-gray-300">
                <ConnectButton />
              </div>

              {/* Menu Items */}
              <nav className="space-y-0">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-3 text-lg font-bold text-black hover:text-gray-600 transition-colors border-b border-gray-200 uppercase tracking-tight"
                    >
                      <span>{item.name}</span>
                      <span className="text-gray-400">→</span>
                    </a>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-gray-300">
                <a href="/license" className="block text-xs text-gray-500 uppercase tracking-wider mb-2 hover:text-gray-700">
                  License
                </a>
                <a href="/terms" className="block text-xs text-gray-500 uppercase tracking-wider mb-6 hover:text-gray-700">
                  Terms & Conditions
                </a>
                <p className="text-xs text-gray-500 mb-1">SHACKO LABS, INC © 2026</p>
                <p className="text-xs text-gray-500 mb-1">MADE WITH ❤️ ON BASE</p>
                <p className="text-xs text-gray-500">HELLO@SHACKO.XYZ</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
