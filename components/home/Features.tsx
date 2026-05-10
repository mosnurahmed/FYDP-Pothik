"use client";

import { motion } from "framer-motion";
import { Bus, MapPinned, Users2, Wallet, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Bus,
    title: "Hassle-free transport",
    body: "AC bus from your nearest pickup point to every spot on the itinerary. No managing your own ride, no waiting at terminals.",
    accent: "from-brand-500 to-brand-700",
  },
  {
    icon: MapPinned,
    title: "Curated sightseeing route",
    body: "We plan the stops, the timing, and how long you spend at each spot — so you see the most without the rush.",
    accent: "from-accent-400 to-accent-600",
  },
  {
    icon: Users2,
    title: "Travel as a group",
    body: "Solo or with family — you'll meet other travellers on the bus. Independent groups, shared road.",
    accent: "from-emerald-500 to-teal-700",
  },
  {
    icon: Wallet,
    title: "Honest, all-in pricing",
    body: "Bus + entry fees + tour leader, all bundled. Hotel and food are on you, but those are the only extras.",
    accent: "from-sky-500 to-indigo-700",
  },
  {
    icon: Clock,
    title: "On time, every time",
    body: "Pickup windows are tight. Buses leave when scheduled. Your time is the most important thing on this trip.",
    accent: "from-violet-500 to-purple-700",
  },
  {
    icon: ShieldCheck,
    title: "Vetted operators",
    body: "Every bus and driver in our fleet meets safety standards we'd want for our own family.",
    accent: "from-rose-500 to-pink-700",
  },
];

export default function Features() {
  return (
    <section className="container-padded py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="section-subtitle">Why Pothik</span>
        <h2 className="section-title mt-3">
          Group travel without the group-chat chaos
        </h2>
        <p className="mt-4 text-ink-600">
          You bring the people you want to travel with — or come alone and
          meet new ones on the bus. We handle the logistics, the route, and
          the timing.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3`}
            >
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.body}</p>
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-brand-50 opacity-0 transition-opacity group-hover:opacity-100 -z-0" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
