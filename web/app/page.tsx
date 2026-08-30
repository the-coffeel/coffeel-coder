import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import TechStack from "@/components/home/TechStack";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function Home() {
  return (
    <>
      <ProtectedLayout>
        <main id="main-content" tabIndex={-1} className="flex-1">
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <TechStack />
          <TestimonialsSection />
          <CTASection />
        </main>
      </ProtectedLayout>

    </>
  );
}