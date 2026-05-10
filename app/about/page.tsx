import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Stats from "@/components/home/Stats";
import { Sparkles, Target, Heart, Compass } from "lucide-react";

const values = [
  {
    icon: Compass,
    title: "Travel that just works",
    body: "We obsess over every step of the journey — search to seat to ride. If a moment feels clunky, it doesn't ship.",
  },
  {
    icon: Heart,
    title: "Honest by default",
    body: "Real prices. Real seats. Real reviews. We never inflate fares at checkout, and we never hide fees in fine print.",
  },
  {
    icon: Target,
    title: "Build for Bangladesh",
    body: "Pothik is made by people who travel these routes. Local context shapes every product decision we make.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="relative overflow-hidden">
          <div className="container-padded py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Our story
                </span>
                <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold text-ink-900 leading-tight">
                  Bus travel,{" "}
                  <span className="text-gradient">re-imagined.</span>
                </h1>
                <p className="mt-5 text-ink-600 leading-relaxed">
                  Pothik started with a simple question: why is booking a bus
                  ticket harder than ordering food? We built the product we
                  wished existed — interactive seat maps, instant
                  confirmations, transparent pricing, and a design that
                  respects your time.
                </p>
                <p className="mt-4 text-ink-600 leading-relaxed">
                  Today, we connect thousands of travellers to verified
                  operators across the country. We're just getting started.
                </p>
              </div>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
                  alt="Highway"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <Stats />

        <section className="container-padded py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-subtitle">What we believe</span>
            <h2 className="section-title mt-3">Three things, no compromises</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-ink-100 bg-white p-7 shadow-soft hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
