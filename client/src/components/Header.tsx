"use client";

import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react"; // Added X for the close state
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* NAVBAR: 
        - bg-[#0a0e27]/60 + backdrop-blur: Creates that "Glass" look.
        - border-white/5: A very subtle line so it doesn't look "heavy".
      */}
      <nav className="fixed top-0 w-full z-50 h-20 px-6 flex items-center justify-between bg-[#0a0e27]/60 backdrop-blur-md border-b border-white/5">
        
        {/* LOGO */}
        <Link href="/">
          <a className="text-4xl font-[Bangers] text-white tracking-tighter drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]">
            SHACKO
          </a>
        </Link>

        {/* CUSTOM CYBER-OCEAN MENU BUTTON */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="relative group p-2 rounded-xl border-2 border-[#00d9ff]/30 bg-[#0a0e27]/40 transition-all duration-300 hover:border-[#00d9ff] hover:scale-105 active:scale-95"
        >
          {/* Subtle Glow Effect on Hover */}
          <div className="absolute inset-0 bg-[#00d9ff] opacity-0 group-hover:opacity-10 blur-md transition-opacity rounded-xl" />
          
          {/* The Icon - Color matches your shark's glowing traits */}
          <Menu size={28} className="text-[#00d9ff] relative z-10" strokeWidth={2.5} />
        </button>
      </nav>

      {/* The Menu Component */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
