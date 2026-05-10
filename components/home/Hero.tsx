"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import SearchBar from "../search/SearchBar";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=80"
          alt="Scenic road through mountains"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-900/75 to-ink-950/95" />
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
      </div>

      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl animate-float" />
      <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl animate-float [animation-delay:2s]" />

      <div className="container-padded relative pt-20 pb-32 md:pt-28 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent-300" />
            Real-time seat selection · Trusted operators
          </span>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
            Travel Bangladesh,{" "}
            <span className="bg-gradient-to-r from-accent-300 via-brand-300 to-brand-100 bg-clip-text text-transparent">
              the smart way.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-ink-200">
            Pick your seat, lock your fare, and ride with confidence. Pothik connects
            you to thousands of departures across the country — with transparent
            pricing and zero hidden fees.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-ink-200">
            <Pill icon={<ShieldCheck className="h-4 w-4" />} text="Verified operators" />
            <Pill icon={<Zap className="h-4 w-4" />} text="Instant confirmation" />
            <Pill icon={<Sparkles className="h-4 w-4" />} text="Live seat updates" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12"
        >
          <SearchBar />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white -z-0 pointer-events-none" />
    </section>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-brand-300">{icon}</span>
      {text}
    </span>
  );
}
