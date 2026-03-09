import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        // Updated to more "rounded" professional Web3 style
        xl: "2rem",
        "2xl": "3rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Your Custom Cyber-Ocean Palette
        ocean: {
          deep: "#0a0e27",    // Your new dark background
          glow: "#00d9ff",    // That neon blue highlight
          muted: "#1a1f3a",   // Card backgrounds
          border: "#2a3f5f",  // Subtle borders
        },
        shacko: {
          pink: "#ec4899",    // About section
          gold: "#fbbf24",    // Staking section
          purple: "#8b5cf6",  // Raffle section
          green: "#10b981",   // Shop section
        },
        // Keeping your HSL system for UI components
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        primary: {
          DEFAULT: "#00d9ff", // Defaulting primary to your brand blue
          foreground: "#0a0e27",
        },
        // ... rest of your HSL mappings remain functional
      },
      fontFamily: {
        // Mapping your Bangers/Fredoka to Tailwind utility classes
        bangers: ["'Bangers'", "cursive"],
        fredoka: ["'Fredoka'", "sans-serif"],
        bebas: ["'Bebas Neue'", "sans-serif"], // Added for that high-end look
        display: ["'Bebas Neue'", "var(--font-display)"],
        body: ["'Fredoka'", "var(--font-body)"],
      },
      dropShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.4)',
        'pink': '0 0 20px rgba(236, 72, 153, 0.4)',
      },
      keyframes: {
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      },
      animation: {
        "marquee": "marquee 25s linear infinite",
        "float": "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
