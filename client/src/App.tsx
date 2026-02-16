import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Staking from "@/pages/Staking";
import Rewards from "@/pages/Rewards";  // ← Add this import
import FAQ from "@/pages/FAQ";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/staking" component={Staking} />
      <Route path="/rewards" component={Rewards} />  {/* ← Add this route */}
      <Route path="/faq" component={FAQ} />
      
      {/* 404 fallback - optional */}
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-[#0ea5e9]">
          <div className="text-center">
            <h1 className="text-6xl font-[Bangers] text-white mb-4">404</h1>
            <p className="text-white text-xl">Page not found!</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
