import { useState } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* CRITICAL: We MUST pass isOpen={isOpen} here. 
        If we don't, the Navbar doesn't know what icon to show.
      */}
      <Navbar onMenuClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
