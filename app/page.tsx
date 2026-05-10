import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FeaturedTours from "@/components/home/FeaturedTours";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Header transparentOnTop />
      <main className="flex-1">
        <Hero />
        <Features />
        <FeaturedTours />
        <Stats />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
