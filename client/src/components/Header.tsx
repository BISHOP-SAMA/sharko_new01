"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function to open/close
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="relative w-full">
      {/* CRITICAL FIX: Pass 'isOpen' to Navbar so the icon 
        can switch between <Menu /> and <X /> 
      */}
      <Navbar onMenuClick={toggleMenu} isOpen={isOpen} />

      {/* The MobileMenu uses top-20 to slide out from 
        directly behind the h-20 Navbar 
      */}
      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </header>
  );
}
