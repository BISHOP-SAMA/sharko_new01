import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter"; // Matches your package.json

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const links = [
    { label: "About", href: "/about" },
    { label: "Lore", href: "/lore" },
    { label: "Arcade", href: "/arcade" },
    { label: "Staking", href: "/staking" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          className="fixed inset-0 bg-[#0ea5e9] z-[90] pt-24 px-6 flex flex-col"
        >
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              <a onClick={onClose} className="text-5xl font-black italic text-white uppercase py-4 border-b-2 border-black/10">
                {link.label}
              </a>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
