"use client";

import { motion } from "framer-motion";
import { Compass, MapPin, Bus, Camera } from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Pick a tour",
    body: "Browse our curated trips — single-day or multi-day. Read the itinerary, see the spots.",
  },
  {
    icon: MapPin,
    title: "Choose your pickup",
    body: "We list 4-6 boarding points per tour. Pick the one closest to home.",
  },
  {
    icon: Bus,
    title: "Hop on the bus",
    body: "Show up on time. We handle the route, the entries, the timing — all of it.",
  },
  {
    icon: Camera,
    title: "Just enjoy",
    body: "Take photos, meet people, see Bangladesh. We'll get you home.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-padded py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="section-subtitle">How it works</span>
        <h2 className="section-title mt-3">From browsing to boarding in 4 steps</h2>
      </div>

      <div className="mt-14 relative">
        <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto h-24 w-24 grid place-items-center">
                <div className="absolute inset-0 rounded-full bg-brand-100" />
                <div className="absolute inset-2 rounded-full bg-white shadow-soft" />
                <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                  <s.icon className="h-7 w-7" />
                </div>
                <span className="absolute -top-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-accent-400 text-xs font-bold text-ink-900 ring-4 ring-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold text-ink-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 max-w-xs mx-auto">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
