import { useState } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="contents">
      {/* 1. We pass 'isOpen' so the icon can render */}
      <Navbar onMenuClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      
      {/* 2. We pass 'onClose' to the menu so links can close it */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
