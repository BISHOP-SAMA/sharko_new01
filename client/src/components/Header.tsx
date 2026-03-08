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
      {/* Passes the 'isOpen' state to Navbar so the button can 
        visually toggle between the Hamburger and the 'X' icon.
      */}
      <Navbar onMenuClick={toggleMenu} isOpen={isOpen} />

      {/* Passes 'isOpen' to the menu panel so Framer Motion 
        can trigger the slide-down animation.
      */}
      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </header>
  );
}
