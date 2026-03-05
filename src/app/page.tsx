import { HeroSection } from "@/components/HeroSection";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { RetryLoopSection, SecuritySection } from "@/components/SecuritySection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-full px-6 py-3 border border-white/10 z-50 bg-zinc-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-white/10 shadow-inner">
              <span className="text-white font-bold text-sm tracking-tighter">P</span>
            </div>
            <div className="text-xl font-bold tracking-tight">
              Plotina<span className="text-emerald-500">.</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition-colors duration-300">Features</a>
            <a href="#security" className="hover:text-zinc-100 transition-colors duration-300">Security</a>
            <a href="#pricing" className="hover:text-zinc-100 transition-colors duration-300">Pricing</a>
          </div>
          <button className="bg-zinc-100 text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <ArchitectureSection />
        <FeaturesSection />
        <RetryLoopSection />
        <SecuritySection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
