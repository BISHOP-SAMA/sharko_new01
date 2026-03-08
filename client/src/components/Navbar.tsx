import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 z-[999] bg-[#0ea5e9] border-b-4 border-black flex items-center shadow-xl">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/">
            <a className="text-4xl font-black italic tracking-tighter text-white uppercase shrink-0"
               style={{ WebkitTextStroke: '1.5px black' }}>
              SHACKO
            </a>
          </Link>
          
          {/* THE BUTTON - Forced to be 50x50 pixels no matter what */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-[50px] h-[50px] min-w-[50px] bg-black border-2 border-white rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all"
          >
            {isOpen ? (
              <X size={30} className="text-white" strokeWidth={3} />
            ) : (
              <Menu size={30} className="text-white" strokeWidth={3} />
            )}
          </button>
        </div>
      </nav>

      {/* Direct Menu Injection */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
