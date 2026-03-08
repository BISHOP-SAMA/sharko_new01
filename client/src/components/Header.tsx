"use client";

import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu"; // Make sure the path is correct

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9] border-b-4 border-black h-20 px-6 flex items-center justify-between">
        <Link href="/">
          <a className="text-4xl font-[Bangers] text-white text-stroke tracking-tighter">
            SHACKO
          </a>
        </Link>

        {/* This button must exist in the header for it to show on every page */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Menu size={28} className="text-black" strokeWidth={3} />
        </button>
      </nav>

      {/* The Menu Component triggered by the state above */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
