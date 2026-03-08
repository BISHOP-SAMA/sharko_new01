import { Menu, X } from "lucide-react";
import { Link } from "wouter";

interface NavbarProps {
  onMenuClick: () => void;
  isOpen: boolean;
}

export default function Navbar({ onMenuClick, isOpen }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#0ea5e9] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/">
          <a className="text-4xl font-black italic tracking-tighter text-white uppercase cursor-pointer"
             style={{ WebkitTextStroke: '1.5px black' }}>
            SHACKO
          </a>
        </Link>
        
        {/* HAMBURGER BUTTON - High visibility styling */}
        <button
          type="button"
          onClick={onMenuClick}
          className="relative z-[110] p-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center"
        >
          {isOpen ? (
            <X size={28} strokeWidth={4} className="text-black" />
          ) : (
            <Menu size={28} strokeWidth={4} className="text-black" />
          )}
        </button>
      </div>
    </nav>
  );
}
