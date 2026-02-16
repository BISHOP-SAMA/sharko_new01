import { Link } from "wouter";
import { SiX, SiDiscord } from "react-icons/si";
import logoImage from "@assets/logo-shark.png";

export function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white py-12 border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logoImage} alt="Shacko Logo" className="w-16 h-16 object-contain" />
          <h2 className="text-6xl font-[Bangers] text-[#38bdf8]">SHACKO</h2>
        </div>

        {/* Tagline */}
        <p className="text-center text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Stake your collection. Track earnings. Claim $ASS with style.
        </p>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-center font-[Bangers] text-2xl text-white mb-4">Quick links</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link href="/">
              <a className="text-gray-400 hover:text-[#38bdf8] transition-colors font-medium">
                Home
              </a>
            </Link>
            <Link href="/staking">
              <a className="text-gray-400 hover:text-[#38bdf8] transition-colors font-medium">
                Staking
              </a>
            </Link>
            <Link href="/rewards">
              <a className="text-gray-400 hover:text-[#38bdf8] transition-colors font-medium">
                Rewards
              </a>
            </Link>
            <Link href="/faq">
              <a className="text-gray-400 hover:text-[#38bdf8] transition-colors font-medium">
                FAQ
              </a>
            </Link>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://x.com/Sharksonbase_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xl font-[Fredoka] font-bold hover:text-[#38bdf8] transition-colors"
            aria-label="Twitter"
          >
            <SiX className="w-6 h-6" /> Twitter
          </a>
          <a
            href="https://discord.gg/dfxMGDTnpM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xl font-[Fredoka] font-bold hover:text-[#38bdf8] transition-colors"
            aria-label="Discord"
          >
            <SiDiscord className="w-6 h-6" /> Discord
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 max-w-3xl mx-auto">
          <h3 className="text-center font-[Bangers] text-2xl text-white mb-3">Disclaimer</h3>
          <p className="text-center text-gray-400 text-sm leading-relaxed">
            This platform simulates staking mechanics for the Shacko NFT collection. 
            Always verify contract addresses and official links before any blockchain transaction. 
            DYOR (Do Your Own Research) and never invest more than you can afford to lose.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-slate-400 font-mono text-sm text-center">
          © 2024 SHACKO NFT COLLECTION. ALL RIGHTS RESERVED. DON'T GET BITTEN.
        </p>
      </div>
    </footer>
  );
}
