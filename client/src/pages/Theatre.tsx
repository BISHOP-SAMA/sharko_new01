import { useState } from "react";
import { Menu } from "lucide-react";
import MobileMenu from "../components/MobileMenu";

export default function Theatre() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0f172a]/90 backdrop-blur-md border-b border-cyan-400/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="md:hidden text-white hover:text-cyan-400 transition-colors"
            >
              <Menu size={32} />
            </button>

            <span 
              className="text-3xl font-bold text-white tracking-wider"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              SHACKO
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="/about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="/staking" className="hover:text-cyan-400 transition-colors">Staking</a>
            <a href="/theatre" className="text-cyan-400 font-bold">Theatre</a>
          </div>
        </div>

        {/* Mobile Menu Component */}
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              SHACKO THEATRE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Your portal to exclusive SHACKO content, behind-the-scenes, and community events
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-2 border-cyan-400/30 rounded-3xl p-12 text-center mb-12">
            <div className="mb-8">
              <span className="text-6xl mb-4 block">🎬</span>
              <h2 
                className="text-5xl md:text-6xl font-bold mb-4 text-cyan-400"
                style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
              >
                COMING SOON
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                We're preparing something spectacular for the SHACKO community. Stay tuned!
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-[#0a0e27] border-2 border-cyan-400/30 rounded-2xl p-6">
                <span className="text-4xl mb-3 block">🎥</span>
                <h3 
                  className="text-2xl font-bold mb-2 text-cyan-400"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  Exclusive Videos
                </h3>
                <p className="text-gray-400">Behind-the-scenes content and tutorials</p>
              </div>

              <div className="bg-[#0a0e27] border-2 border-cyan-400/30 rounded-2xl p-6">
                <span className="text-4xl mb-3 block">🎮</span>
                <h3 
                  className="text-2xl font-bold mb-2 text-cyan-400"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  Live Events
                </h3>
                <p className="text-gray-400">Community gatherings and Q&A sessions</p>
              </div>

              <div className="bg-[#0a0e27] border-2 border-cyan-400/30 rounded-2xl p-6">
                <span className="text-4xl mb-3 block">📺</span>
                <h3 
                  className="text-2xl font-bold mb-2 text-cyan-400"
                  style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                >
                  Broadcasts
                </h3>
                <p className="text-gray-400">Special announcements and updates</p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-400/30 rounded-3xl p-12 text-center">
            <h3 
              className="text-4xl md:text-5xl font-bold mb-4 text-purple-400"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              GET NOTIFIED
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be the first to know when Theatre launches. Subscribe to updates!
            </p>

            {subscribed ? (
              <div className="bg-green-500/20 border-2 border-green-400 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-2xl font-bold text-green-400">
                  ✅ Thanks for subscribing!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-[#0a0e27] border-2 border-purple-400/30 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
                    style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bubbles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 100}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-100vh) rotate(360deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
