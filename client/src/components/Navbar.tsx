"use client";

import { Menu, X } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  isOpen: boolean; // Add this to track the menu state
}

export default function Navbar({ onMenuClick, isOpen }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* SHACKO Logo - Added italic/black style to match site headers */}
        <span className="text-4xl font-black italic tracking-tighter text-white uppercase" 
              style={{ WebkitTextStroke: '1.5px black' }}>
          SHACKO
        </span>
        
        {/* Hamburger Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          // Changed to white bg with black border to match the "Explore the Ocean" button style
          className="p-2 bg-white border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X size={32} strokeWidth={4} className="text-black" />
          ) : (
            <Menu size={32} strokeWidth={4} className="text-black" />
          )}
        </button>
      </div>
    </nav>
  );
}
