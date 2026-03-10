import { Link } from "wouter";
import { SiX, SiDiscord } from "react-icons/si";
import logoImage from "@assets/logo-shark.png";

export function Footer() {
  return (
    <footer className="bg-[#0a0e27] text-white py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          <img src={logoImage} alt="Shacko Logo" className="w-20 h-20 object-contain" />
          <h2 className="text-5xl font-black tracking-tighter text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            SHACKO
          </h2>
        </div>

        {/* Full Collection of Quick Links */}
        <div className="mb-12">
          <div className="flex justify-center gap-x-10 gap-y-5 flex-wrap max-w-4xl mx-auto">
            {[
              { name: "HOME", href: "/" },
              { name: "STAKING", href: "/staking" },
              { name: "RAFFLE", href: "/raffle" },
              { name: "ARCADE", href: "/arcade" },
              { name: "REWARDS", href: "/rewards" },
              { name: "SHOP", href: "/shop" },
              { name: "THEATRE", href: "/theatre" },
              { name: "LORE", href: "/lore" },
              { name: "ROADMAP", href: "/roadmap" },
              { name: "ABOUT", href: "/about" },
              { name: "FAQ", href: "/faq" }
            ].map((link) => (
              <Link key={link.name} href={link.href}>
                <a className="text-[11px] tracking-[0.25em] text-gray-400 hover:text-[#00d9ff] transition-all font-medium uppercase">
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-10 mb-12">
          <a
            href="https://x.com/Sharksonbase_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-widest font-bold text-gray-300 hover:text-[#00d9ff] transition-colors uppercase"
            aria-label="Twitter"
          >
            <SiX className="w-5 h-5" /> Twitter
          </a>
          <a
            href="https://discord.gg/dfxMGDTnpM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-widest font-bold text-gray-300 hover:text-[#00d9ff] transition-colors uppercase"
            aria-label="Discord"
          >
            <SiDiscord className="w-5 h-5" /> Discord
          </a>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="max-w-2xl mx-auto pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] tracking-[0.15em] text-gray-500 leading-relaxed uppercase mb-4 opacity-70">
            Shacko is a digital collectible project. Always verify official links before interacting with your wallet.
          </p>
          <p className="text-[10px] tracking-[0.2em] text-gray-600 font-mono">
            © 2026 SHACKO NFT COLLECTION. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
