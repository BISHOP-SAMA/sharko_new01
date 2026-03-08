"use client";

import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* SHACKO Logo Text */}
        <span className="text-4xl font-bold tracking-tight text-white">SHACKO</span>
        
        {/* Hamburger Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2.5 bg-black/20 rounded-lg text-white hover:bg-black/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Open navigation menu"
        >
          <Menu size={32} strokeWidth={3} />
        </button>
      </div>
    </nav>
  );
}
