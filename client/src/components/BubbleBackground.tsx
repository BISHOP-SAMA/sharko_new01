import { motion } from "framer-motion";

const Bubble = ({ size, delay, left }: { size: number; delay: number; left: string }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 0.4, 0.4, 0],
      x: ["0%", "2%", "-2%", "0%"] 
    }}
    transition={{ 
      duration: 15, 
      repeat: Infinity, 
      delay, 
      ease: "linear" 
    }}
    className="fixed rounded-full bg-white/20 backdrop-blur-sm pointer-events-none z-0"
    style={{ width: size, height: size, left }}
  />
);

export default function BubbleBackground() {
  const bubbles = [
    { size: 40, left: "10%", delay: 0 },
    { size: 20, left: "25%", delay: 5 },
    { size: 60, left: "45%", delay: 2 },
    { size: 30, left: "70%", delay: 8 },
    { size: 50, left: "85%", delay: 4 },
    { size: 25, left: "55%", delay: 10 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
      {bubbles.map((b, i) => (
        <Bubble key={i} {...b} />
      ))}
    </div>
  );
}
