// 1. Add useState to your imports at the top
import { useState } from "react";
import { Menu } from "lucide-react"; 

// ... inside your Theatre component function:
export default function Theatre() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add this state
  
  // ... existing states for email/subscribed
  
  return (
    <div className="min-h-screen ...">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0f172a]/90 backdrop-blur-md border-b border-[#ec4899]/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            {/* 2. Toggle button for your existing MobileMenu */}
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="md:hidden text-white hover:text-[#ec4899] transition-colors"
            >
              <Menu size={32} />
            </button>

            <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
            <span className="text-3xl font-[Bangers] text-white tracking-wider">SHACKO</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="hover:text-[#ec4899] transition-colors">Home</a>
            <a href="/about" className="hover:text-[#ec4899] transition-colors">About</a>
            <a href="/staking" className="hover:text-[#ec4899] transition-colors">Staking</a>
            <a href="/theatre" className="text-[#ec4899] font-bold">Theatre</a>
          </div>
        </div>

        {/* 3. Your existing MobileMenu component */}
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </nav>
      
      {/* Rest of your Theatre code... */}
