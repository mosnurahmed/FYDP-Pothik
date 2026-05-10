"use client";

import { motion } from "framer-motion";
import { Bus, Map, Smile, ShieldCheck } from "lucide-react";

const stats = [
  { value: "120+", label: "Trusted operators", icon: Bus },
  { value: "350+", label: "Daily departures", icon: Map },
  { value: "50K+", label: "Happy travellers", icon: Smile },
  { value: "99.7%", label: "On-time arrival", icon: ShieldCheck },
];

export default function Stats() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="container-padded">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
                <s.icon className="h-7 w-7 text-brand-200" />
              </div>
              <div className="mt-4 font-display text-4xl md:text-5xl font-bold text-white tabular-nums">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-brand-200">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
