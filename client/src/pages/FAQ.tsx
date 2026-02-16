import { motion, AnimatePresence } from "framer-motion";
import { FloatingSharks } from "@/components/FloatingSharks";
import { MobileMenu } from "@/components/MobileMenu";
import { Footer } from "@/components/Footer";
import { HelpCircle, ChevronDown, Shield } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/logo-shark.png";

const faqs = [
  {
    question: "Is this connected to a real blockchain wallet?",
    answer: "Yes! Shacko runs on Base blockchain. Connect your MetaMask or compatible Web3 wallet to stake your NFTs and earn $ASS tokens. All transactions are on-chain and verifiable."
  },
  {
    question: "Can I claim rewards before the stake ends?",
    answer: "Yes. Use the Claim action on the Staking page. The quote displays earned vs claimable. You can harvest your $ASS tokens anytime, but longer stakes get better multipliers!"
  },
  {
    question: "What happens when I unstake?",
    answer: "When you unstake, your NFT is returned to your wallet immediately. Any unclaimed $ASS rewards remain available to claim. You can restake anytime to continue earning."
  },
  {
    question: "How are daily earnings calculated?",
    answer: "Daily earnings = Base Rate × Rarity Multiplier × Duration Bonus. For example: Legendary NFT (80 $ASS/day) × 3.0x rarity × 2.0x (60-day bonus) = massive gains! Check the Rewards page for full breakdown."
  },
  {
    question: "Why does the quote refresh?",
    answer: "Quotes auto-refresh every 10 seconds for a live feeling. This shows your $ASS accumulating in real-time. This can be tuned or made real-time later with websockets."
  },
  {
    question: "What's the staking fee?",
    answer: "There's a $1 staking fee (paid in USDC) when you stake an NFT. This small fee helps maintain the platform and ensures serious stakers. All rewards are paid in $ASS tokens."
  },
  {
    question: "Can I stake multiple NFTs?",
    answer: "Absolutely! Stack as many sharks as you want. Each NFT earns independently based on its rarity and staking duration. Mix and match different tiers for maximum gains."
  },
  {
    question: "What are the rarity tiers?",
    answer: "Shacko has 5 tiers: Common (1.0x), Uncommon (1.25x), Rare (1.5x), Epic (2.0x), and Legendary (3.0x). Higher rarity = higher multipliers = more $ASS tokens!"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <FloatingSharks />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <img src={logoImage} alt="Shacko" className="w-12 h-12" />
            <span className="text-2xl font-[Bangers] text-white">SHACKO</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] rounded-3xl p-8 border-2 border-[#0ea5e9]/30"
          >
            <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/20 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-5 h-5 text-[#0ea5e9]" />
              <span className="text-sm font-bold text-[#0ea5e9] uppercase">FAQ</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-[Bangers] mb-4 text-white">
              Answers from the <span className="text-[#0ea5e9]">Sharks</span>
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed">
              Everything you need to know to stake confidently — professional, simple, and transparent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] border-2 border-[#0ea5e9]/30 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-[#0ea5e9]/10 transition-colors"
              >
                <h3 className="text-xl font-bold pr-4 text-white">{faq.question}</h3>
                <ChevronDown
                  className={`w-6 h-6 text-[#0ea5e9] flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-200 leading-relaxed border-t border-[#0ea5e9]/20 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety Note */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] border-2 border-[#0ea5e9]/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#0ea5e9]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">Safety note</h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  Always verify contract addresses and official links in a production release. 
                  This UI is a premium MVP shell built for the Shacko community.
                </p>
                <div className="bg-[#0f172a]/50 border border-[#0ea5e9]/20 rounded-xl p-4">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Want more features?</strong> Consider: wallet connect, 
                    stake history, rarity leaderboards, and real-time earnings streams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-2xl p-12 border-4 border-black"
          >
            <h2 className="text-4xl font-[Bangers] mb-4 text-white">Still have questions?</h2>
            <p className="text-lg mb-6 text-white/90">
              Join our Discord community and ask the sharks directly!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://discord.gg/dfxMGDTnpM"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#0ea5e9] px-8 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform inline-block"
              >
                JOIN DISCORD →
              </a>
              <a
                href="https://x.com/Sharksonbase_"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1e293b] text-white px-8 py-4 rounded-xl font-[Bangers] text-xl border-4 border-black hover:scale-105 transition-transform inline-block"
              >
                FOLLOW ON X →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
