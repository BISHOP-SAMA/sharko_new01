import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // Set root to client/ — Vite will look for index.html there
  root: "./client",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),      // Use __dirname instead of import.meta.dirname (more reliable in some envs)
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  build: {
    // Output to root/dist/public (your current setting)
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
