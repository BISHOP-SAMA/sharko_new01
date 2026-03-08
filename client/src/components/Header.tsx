import { useState } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="relative w-full">
      {/* YOU MUST PASS isOpen={isOpen} HERE */}
      <Navbar onMenuClick={toggleMenu} isOpen={isOpen} />
      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </header>
  );
}
