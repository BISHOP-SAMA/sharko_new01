// client/src/components/MobileMenu.tsx
import { Link } from "wouter";

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

// Inside your MobileMenu return...
{menuLinks.map((link) => (
  <Link key={link.path} href={link.path}>
    <a className="text-5xl font-[Bangers] italic text-white uppercase py-2 hover:text-[#fbbf24] transition-colors border-b-2 border-white/10 w-full text-center">
      {link.name}
    </a>
  </Link>
))}
