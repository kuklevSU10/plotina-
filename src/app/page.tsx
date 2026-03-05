import { HeroSection } from "@/components/HeroSection";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { RetryLoopSection, SecuritySection } from "@/components/SecuritySection";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/global/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500/30">
      <NavBar />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <div className="section-divider" />
        <ArchitectureSection />
        <div className="section-divider" />
        <FeaturesSection />
        <div className="section-divider" />
        <RetryLoopSection />
        <div className="section-divider" />
        <SecuritySection />
        <div className="section-divider" />
        <PricingSection />
        <div className="section-divider" />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
