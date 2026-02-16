## Packages
framer-motion | Animations for the playful cartoon aesthetic
zod | Schema validation (already in base but ensuring version match)
@hookform/resolvers | For Zod integration with React Hook Form
clsx | Utility for conditional classes
tailwind-merge | Utility for merging Tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["'Bangers'", "cursive", "var(--font-display)"], // Fun cartoon font
  body: ["'Fredoka'", "sans-serif", "var(--font-body)"], // Rounded playful body font
}
Images are located at /images/ (e.g., /images/hero-shark.png)
API Endpoint for registration: POST /api/register
