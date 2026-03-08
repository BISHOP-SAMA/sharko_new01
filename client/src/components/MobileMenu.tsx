import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "About", href: "/about" },
    { name: "Lore", href: "/lore" },
    { name: "Raffles", href: "/raffles" },
    { name: "Shark bank", href: "/shark-bank" },
    { name: "Shacko Pump", href: "/shacko-pump" },
    { name: "Theatre", href: "/theatre" },
    { name: "Staking", href: "/staking" },
    { name: "Rewards", href: "/rewards" },
    { name: "Community", href: "/community" },
    { name: "Store", href: "#shop" },
    { name: "FAQ", href: "/faq" },
    { name: "Socials", href: "#socials" },
  ]; // ← Fixed: Added closing bracket and semicolon

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[100]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-gray-200">
              <span className="text-2xl font-bold tracking-tight text-black">SHACKO</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={28} strokeWidth={2.5} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="px-6 py-8">
              {/* Connect Wallet Button */}
              <div className="mb-12 pb-8 border-b border-gray-200">
                <h3 className="text-red-500 font-bold text-sm mb-4 uppercase tracking-wider">
                  Connect Wallet
                </h3>
                <ConnectButton />
              </div>

              {/* Menu Items */}
              <nav className="space-y-0">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-4 text-2xl font-bold text-black hover:text-gray-600 transition-colors border-b border-gray-100 uppercase tracking-tight"
                    >
                      {item.name}
                      <span className="float-right text-gray-400">→</span>
                    </a>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">License</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Terms & Conditions</p>
                <p className="text-xs text-gray-500 mt-6">SHACKO LABS, INC © 2026</p>
                <p className="text-xs text-gray-500">MADE WITH ❤️ ON BASE</p>
                <p className="text-xs text-gray-500">HELLO@SHACKO.XYZ</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
