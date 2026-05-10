"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="container-padded pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 px-8 py-16 md:px-16 md:py-20"
      >
        <div className="absolute inset-0 -z-10 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent-400/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Bangladesh, off the beaten path
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-tight text-white">
            One bus. One curated route.{" "}
            <span className="bg-gradient-to-r from-accent-300 to-brand-200 bg-clip-text text-transparent">
              Many memories.
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-200">
            See the country with people who actually want to be on the road.
            Pothik runs the bus, you bring the soundtrack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-6 py-3.5 font-semibold text-ink-900 shadow-lg transition-all hover:bg-accent-300 hover:shadow-xl active:scale-[0.98]"
            >
              Browse all tours
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
            >
              Create free account
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
