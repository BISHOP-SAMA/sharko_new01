import { Link } from "wouter";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Raffles", path: "/raffle" },
  { name: "Staking", path: "/staking" },
  { name: "Arcade", path: "/arcade" },
  { name: "Shop", path: "/shop" },
  { name: "Theatre", path: "/theatre" },
  { name: "Lore", path: "/lore" },
  { name: "About", path: "/about" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Ensure "export default" is used here
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center p-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white border-4 border-black text-black"
          >
            <X size={32} strokeWidth={4} />
          </button>

          <nav className="flex flex-col gap-4 w-full">
            {menuLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a 
                  onClick={onClose}
                  className="text-5xl font-[Bangers] italic text-white uppercase py-2 hover:text-[#fbbf24] transition-colors border-b-2 border-white/10 w-full text-center"
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
