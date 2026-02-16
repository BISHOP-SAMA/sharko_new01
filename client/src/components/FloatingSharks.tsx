import { motion } from "framer-motion";

export function FloatingSharks() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background decoration bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400/10"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 100 
          }}
          animate={{ 
            y: -100,
            x: `calc(${Math.random() * 100}vw)`
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          style={{
            width: 20 + Math.random() * 100,
            height: 20 + Math.random() * 100,
          }}
        />
      ))}
    </div>
  );
}
