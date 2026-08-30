import AnnouncementBanner from "@/components/home/AnnouncementBanner";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import CCLayout from "@/components/layouts/CCLayout";
import TechStack from "@/components/home/TechStack";

export default function Home() {
  return (
    <>
    <CCLayout>
      <AnnouncementBanner />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TechStack/>
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />

    </CCLayout>
    </>
  );
}