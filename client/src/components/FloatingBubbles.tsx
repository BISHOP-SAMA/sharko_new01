import { motion } from "framer-motion";

export function FloatingBubbles() {
  // Generate more bubbles for better underwater effect
  const bubbleCount = 20;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Rising bubbles from bottom to top */}
      {[...Array(bubbleCount)].map((_, i) => {
        const size = 10 + Math.random() * 60; // Random sizes between 10-70px
        const delay = Math.random() * 15; // Stagger start times
        const duration = 15 + Math.random() * 25; // Varying speeds (15-40s)
        const startX = Math.random() * 100; // Random horizontal start position (%)
        const drift = (Math.random() - 0.5) * 30; // Horizontal drift during rise

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 30% 30%, 
                rgba(56, 189, 248, ${0.15 + Math.random() * 0.25}), 
                rgba(14, 165, 233, ${0.05 + Math.random() * 0.15}))`,
              boxShadow: `0 0 ${size / 2}px rgba(56, 189, 248, 0.3)`,
              left: `${startX}%`,
            }}
            initial={{ 
              y: "100vh", // Start below viewport
              x: 0,
              scale: 0.5,
              opacity: 0,
            }}
            animate={{ 
              y: "-20vh", // End above viewport
              x: drift,
              scale: [0.5, 1, 0.8, 1, 0.5],
              opacity: [0, 0.8, 1, 0.8, 0],
            }}
            transition={{ 
              duration,
              repeat: Infinity,
              ease: "linear",
              delay,
              scale: {
                duration: duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: duration,
                ease: "easeInOut",
              }
            }}
          />
        );
      })}

      {/* Smaller micro-bubbles for depth */}
      {[...Array(30)].map((_, i) => {
        const size = 3 + Math.random() * 8; // Tiny bubbles
        const delay = Math.random() * 20;
        const duration = 10 + Math.random() * 15;
        const startX = Math.random() * 100;

        return (
          <motion.div
            key={`micro-${i}`}
            className="absolute rounded-full bg-blue-300/20"
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
            }}
            initial={{ 
              y: "105vh",
              opacity: 0,
            }}
            animate={{ 
              y: "-10vh",
              opacity: [0, 0.6, 0],
            }}
            transition={{ 
              duration,
              repeat: Infinity,
              ease: "linear",
              delay,
            }}
          />
        );
      })}

      {/* Ocean current waves (subtle background movement) */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 0%, 
            rgba(14, 165, 233, 0.03) 50%, 
            transparent 100%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
