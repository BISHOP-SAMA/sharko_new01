import React from "react";
import { Route, Switch } from "wouter";
import { FloatingBubbles } from "@/components/FloatingBubbles";

// Page Imports
import Home from "@/pages/Home";
import About from "@/pages/About";
import Staking from "@/pages/Staking";
import Rewards from "@/pages/Rewards";
import FAQ from "@/pages/FAQ";
import Arcade from "@/pages/Arcade";
import Lore from "@/pages/Lore";
import Raffle from "@/pages/Raffle";
import Roadmap from "@/pages/Roadmap";
import Shop from "@/pages/Shop";
import Theatre from "@/pages/Theatre";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <>
      {/* Global Floating Bubbles - appears on all pages */}
      <FloatingBubbles />
      
      <Switch>
        {/* Primary Routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/staking" component={Staking} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/faq" component={FAQ} />
        
        {/* Project Expansion Routes */}
        <Route path="/arcade" component={Arcade} />
        <Route path="/lore" component={Lore} />
        <Route path="/raffle" component={Raffle} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/shop" component={Shop} />
        <Route path="/theatre" component={Theatre} />

        {/* 404 fallback using your dedicated not-found component */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
