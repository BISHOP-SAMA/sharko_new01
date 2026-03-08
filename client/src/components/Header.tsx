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
      {/* The Navbar stays on top (z-50). 
        Pass the toggle function to your existing Navbar component.
      */}
      <Navbar onMenuClick={toggleMenu} />

      {/* The MobileMenu sits behind/below (z-40).
        It listens to the 'isOpen' state managed here.
      */}
      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </header>
  );
}
