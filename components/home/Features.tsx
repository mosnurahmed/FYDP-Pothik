"use client";

import { motion } from "framer-motion";
import { Armchair, ShieldCheck, Wallet, Clock, Bus, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Armchair,
    title: "Pick your exact seat",
    body: "Real-time interactive seat layout. See who's booked, who's not, and lock in the seat you want — front row, window, or aisle.",
    accent: "from-brand-500 to-brand-700",
  },
  {
    icon: ShieldCheck,
    title: "Verified operators only",
    body: "Every bus operator on Pothik is hand-checked for safety records, punctuality, and passenger reviews.",
    accent: "from-accent-400 to-accent-600",
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    body: "What you see is what you pay. No surprise fees, no inflated charges at checkout. Ever.",
    accent: "from-emerald-500 to-teal-700",
  },
  {
    icon: Clock,
    title: "Instant confirmation",
    body: "Your ticket arrives in your inbox the moment payment clears. No waiting, no anxious phone calls.",
    accent: "from-sky-500 to-indigo-700",
  },
  {
    icon: Bus,
    title: "Live route tracking",
    body: "Know where your bus is. Track departures and arrivals in real time — for you and the people picking you up.",
    accent: "from-violet-500 to-purple-700",
  },
  {
    icon: HeartHandshake,
    title: "Easy cancellations",
    body: "Plans changed? Cancel up to 6 hours before departure and get refunded — no questions asked.",
    accent: "from-rose-500 to-pink-700",
  },
];

export default function Features() {
  return (
    <section className="container-padded py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="section-subtitle">Why Pothik</span>
        <h2 className="section-title mt-3">
          Built for the way you actually travel
        </h2>
        <p className="mt-4 text-ink-600">
          Every feature is shaped by one question: would this make a real journey better?
          If the answer is no, it doesn't ship.
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
