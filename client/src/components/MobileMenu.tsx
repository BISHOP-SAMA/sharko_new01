import { useState } from "react";
import { Menu, X } from "lucide-react"; // ← Re-added Menu import
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
      {/* Hamburger Button – visible on the main page */}
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
            className="fixed inset-0 bg-gradient-to-b from-[#0077ff] to-[#0055cc] z-[100] flex flex-col text-white" // ← Blue ocean theme to match homepage
          >
            {/* Minimal header: thin black line + close button only */}
            <div className="sticky top-0 bg-transparent z-10">
              <div className="flex items-center justify-end px-6 h-14 border-b border-black">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-black/20 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={28} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content starts immediately under the black line */}
            <div className="flex-1 px-6 py-8 overflow-y-auto">
              {/* Connect Wallet section */}
              <div className="mb-10 pb-8 border-b border-white/20">
                <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">
                  Connect Wallet
                </h3>
                <div className="max-w-xs">
                  <ConnectButton />
                </div>
              </div>

              {/* Navigation items */}
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="block py-4 text-2xl font-bold uppercase tracking-wide hover:text-blue-200 transition-colors border-b border-white/10 last:border-b-0"
                  >
                    {item.name}
                    <span className="float-right text-white/60">→</span>
                  </motion.a>
                ))}
              </nav>

              {/* Optional: keep footer minimal or remove if you want */}
              {/* <div className="mt-12 pt-8 text-sm text-white/60">
                <p>SHACKO © 2026</p>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}