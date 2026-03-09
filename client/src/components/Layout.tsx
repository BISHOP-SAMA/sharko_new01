import Header from "./Header";
import BubbleBackground from "./BubbleBackground"; // Import the bubbles

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* 1. The Bubbles (Stay in the background) */}
      <BubbleBackground />

      {/* 2. The Header (Stays on top) */}
      <Header />
      
      {/* 3. The Content */}
      <main className="relative z-10 flex-grow">
        {children}
      </main>
    </div>
  );
}
