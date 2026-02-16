import { motion } from "framer-motion";  // ← Remove the duplicate below
import { FloatingSharks } from "@/components/FloatingSharks";
import { Footer } from "@/components/Footer";
import logoImage from "@assets/logo-shark.png";
import bishopImage from "@assets/Bishop.jpg";
import allwellImage from "@assets/Allwell.jpg";
import kageImage from "@assets/Kage.jpg";
import { Link } from "wouter";
import { SiX, SiDiscord } from "react-icons/si";

const team = [
  {
    name: "BISHOP",
    role: "Product Manager",
    image: bishopImage,
    traits: ["Jack of all trades", "Works without break", "Part time degen"]
  },
  {
    name: "Allwell",
    role: "Developer",
    image: allwellImage,
    traits: ["He's the small voice you hear in your head sometimes", "Always pitching ideas somewhere to someone", "Fast leaner"]
  },
  {
    name: "KAGE",
    role: "CM",
    image: kageImage,
    traits: ["Loses money everyday trading", "Collaborative learner", "The missing piece your project needs"]
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc] selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      <FloatingSharks />
      
      <nav className="fixed top-0 w-full z-50 bg-[#0ea5e9]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src={logoImage} alt="Shacko Logo" className="w-12 h-12 object-contain" />
              <span className="text-3xl font-[Bangers] text-white text-stroke tracking-widest">
                SHACKO
              </span>
            </a>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about"><a className="font-[Bangers] text-xl text-white hover:text-[#ec4899] transition-colors">About</a></Link>
            <Link href="/staking"><a className="font-[Bangers] text-xl text-white hover:text-[#ec4899] transition-colors">Staking</a></Link>
            <Link href="/"><a className="font-[Bangers] text-xl text-white hover:text-[#ec4899] transition-colors">Home</a></Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-7xl md:text-9xl font-[Bangers] text-white text-stroke mb-6">MEET THE SQUAD</h1>
            <p className="text-2xl font-bold text-slate-800">The masterminds behind the chomp.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-4 border-black rounded-3xl p-8 comic-shadow"
              >
                <div className="aspect-square rounded-2xl border-4 border-black overflow-hidden mb-6">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-4xl font-[Bangers] text-[#0ea5e9] mb-1">{member.name}</h2>
                <p className="text-xl font-bold text-[#ec4899] mb-4 uppercase">{member.role}</p>
                <ul className="space-y-2">
                  {member.traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-2 font-bold text-slate-700">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-black shrink-0" />
                      {trait}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />  {/* ← Only this! Remove the old <footer> section above */}
    </div>
  );
                }
