"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Tanvir Ahmed",
    role: "Software engineer, Dhaka",
    quote:
      "I used to dread booking buses. Pothik flipped that — pick the seat I want, see the price upfront, ticket in my inbox in 30 seconds. This is how it should work.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    name: "Farhana Rahman",
    role: "University student, Sylhet",
    quote:
      "Travelled home for Eid using Pothik. Confirmation was instant, the bus was exactly on time, and the seat was the one I picked. Recommended to my whole family.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    name: "Imran Hossain",
    role: "Travel blogger",
    quote:
      "The seat-map UI is the best I've seen on any Bangladeshi platform. Clean, fast, no broken pages. Whoever built this — they actually care.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="container-padded py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="section-subtitle">Traveller stories</span>
        <h2 className="section-title mt-3">
          People are switching — and not looking back
        </h2>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-2xl border border-ink-100 bg-white p-7 shadow-soft transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <Quote className="h-8 w-8 text-brand-200" strokeWidth={1.5} />
            <div className="mt-4 flex gap-1">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star
                  key={j}
                  className="h-4 w-4 fill-accent-400 text-accent-400"
                />
              ))}
            </div>
            <blockquote className="mt-4 text-[15px] leading-relaxed text-ink-700">
              "{r.quote}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-ink-100">
              <Image
                src={r.avatar}
                alt={r.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-ink-900 text-sm">{r.name}</div>
                <div className="text-xs text-ink-500">{r.role}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
