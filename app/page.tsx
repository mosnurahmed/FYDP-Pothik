import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import PopularRoutes from "@/components/home/PopularRoutes";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <PopularRoutes />
        <Stats />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
