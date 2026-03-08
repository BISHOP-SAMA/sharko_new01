"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

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
    <>
      {/* Hamburger button – only on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-white hover:text-blue-300 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={28} strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop – click to close, blurs hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
              onClick={() => setOpen(false)}
            />

            {/* Side panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-[360px] bg-gradient-to-b from-[#001122] to-[#000814] z-[1000] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-6 right-6 z-10 text-white hover:text-blue-300 transition-colors p-2"
                aria-label="Close navigation menu"
              >
                <X size={32} strokeWidth={2.5} />
              </button>

              {/* Content */}
              <div className="pt-20 px-6 pb-10">
                {/* Connect Wallet */}
                <div className="mb-10">
                  <div className="text-blue-300 uppercase font-semibold tracking-wide text-base mb-4">
                    Connect Wallet
                  </div>
                  <ConnectButton />
                </div>

                {/* Links */}
                <nav className="flex flex-col gap-5">
                  {links.map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 + 0.1 }}
                      className="text-white text-xl font-bold uppercase tracking-wide hover:text-blue-300 transition-colors flex items-center justify-between"
                    >
                      {item.label}
                      <span className="text-blue-500 opacity-70 text-2xl">→</span>
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