"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone } from "lucide-react";

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

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Ready when you are
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-tight text-white">
              Your next journey is{" "}
              <span className="bg-gradient-to-r from-accent-300 to-brand-200 bg-clip-text text-transparent">
                three taps away.
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-200">
              Join the travellers who stopped queuing at counters and started
              booking from their pocket. Free to use, transparent pricing,
              cancel anytime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-6 py-3.5 font-semibold text-ink-900 shadow-lg transition-all hover:bg-accent-300 hover:shadow-xl active:scale-[0.98]"
              >
                Find buses now
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

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative w-72 h-[480px] rounded-[2.5rem] border-8 border-ink-900 bg-ink-950 shadow-2xl overflow-hidden rotate-6 hover:rotate-0 transition-transform duration-700">
                <div className="h-full bg-gradient-to-br from-brand-500 to-brand-800 p-6 text-white">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-xs font-semibold">Pothik App</span>
                  </div>
                  <div className="mt-8 text-3xl font-display font-bold">
                    Dhaka → <br />
                    Cox's Bazar
                  </div>
                  <div className="mt-2 text-sm opacity-80">Tomorrow · 09:30 PM</div>

                  <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur p-4">
                    <div className="flex items-center justify-between text-xs opacity-90">
                      <span>Seat</span>
                      <span>A12 (Window)</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs opacity-90">
                      <span>Total</span>
                      <span className="font-semibold">৳ 1,200</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 rounded-md ${
                          [3, 7, 12, 19, 24].includes(i)
                            ? "bg-accent-400"
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl bg-accent-400 py-3 text-center font-semibold text-ink-900">
                    Confirm booking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
