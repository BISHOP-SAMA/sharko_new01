// main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Wagmi + RainbowKit wrapper
import { WagmiWrapper } from "./wagmiClient";

const container = document.getElementById("root") as HTMLElement;

createRoot(container).render(
  <React.StrictMode>
    <WagmiWrapper>
      <App />
    </WagmiWrapper>
  </React.StrictMode>
);