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
      {/* Hamburger button on main page */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={28} strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop – semi-transparent so hero is visible underneath */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
              onClick={() => setIsOpen(false)} // close on backdrop click
            />

            {/* Side panel slide-in from right – starts near top */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-[#001f3f] to-[#000814] z-[100] overflow-y-auto shadow-2xl"
            >
              {/* Close button – floating top-right, no full header bar */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 text-white hover:text-blue-300 transition-colors z-10"
                aria-label="Close menu"
              >
                <X size={32} strokeWidth={2.5} />
              </button>

              {/* Content starts near top – small padding only */}
              <div className="pt-20 px-6 pb-10"> {/* pt-20 gives space under close button */}
                {/* Connect Wallet – prominent */}
                <div className="mb-10">
                  <h3 className="text-blue-300 font-bold text-lg uppercase tracking-wider mb-4">
                    Connect Wallet
                  </h3>
                  <ConnectButton />
                </div>

                {/* Menu items – clean, spaced, with arrow */}
                <nav className="space-y-6">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="block text-2xl font-bold uppercase tracking-wide text-white hover:text-blue-300 transition-colors flex items-center justify-between"
                    >
                      {item.name}
                      <span className="text-blue-500 text-3xl">→</span>
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}