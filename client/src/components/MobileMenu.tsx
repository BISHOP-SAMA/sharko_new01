"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function MobileMenu() {
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
      {/* Hamburger button – visible only on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden p-2.5 text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
        aria-label="Open navigation menu"
      >
        <Menu size={28} strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop – blurs background and closes on tap outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
              onClick={() => setOpen(false)}
            />

            {/* Sliding side panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-[380px] bg-gradient-to-b from-[#001122] to-[#000814] z-[1000] overflow-y-auto shadow-2xl"
            >
              {/* Floating close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-6 right-6 z-10 p-3 text-white hover:text-blue-300 hover:scale-110 transition-all duration-200"
                aria-label="Close navigation menu"
              >
                <X size={32} strokeWidth={2.5} />
              </button>

              {/* Menu content */}
              <div className="pt-24 px-6 pb-12">
                {/* Connect Wallet section */}
                <div className="mb-12">
                  <div className="text-blue-300 uppercase font-semibold tracking-wider text-base mb-5">
                    Connect Wallet
                  </div>
                  <div className="max-w-[320px]">
                    <ConnectButton />
                  </div>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col gap-6">
                  {links.map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.15 }}
                      className="group flex items-center justify-between text-xl font-bold text-white uppercase tracking-wide hover:text-blue-300 transition-all duration-300 hover:translate-x-2"
                    >
                      <span>{item.label}</span>
                      <span className="text-blue-500 opacity-70 text-3xl transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
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