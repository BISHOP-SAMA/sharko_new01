import { Menu, X } from "lucide-react";
import { Link } from "wouter";

interface NavbarProps {
  onMenuClick: () => void;
  isOpen: boolean;
}

export default function Navbar({ onMenuClick, isOpen }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full h-20 z-[100] bg-[#0ea5e9] border-b-4 border-black flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        
        {/* SHACKO Logo */}
        <Link href="/">
          <a className="text-4xl font-black italic tracking-tighter text-white uppercase cursor-pointer"
             style={{ WebkitTextStroke: '1.5px black' }}>
            SHACKO
          </a>
        </Link>
        
        {/* HAMBURGER BUTTON - Styled like the Geez site button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents clicks from bubbling
            onMenuClick();
          }}
          className="relative z-[110] p-2 bg-black border-2 border-white rounded-md flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X size={28} strokeWidth={3} className="text-white" />
          ) : (
            <Menu size={28} strokeWidth={3} className="text-white" />
          )}
        </button>
      </div>
    </nav>
  );
}
