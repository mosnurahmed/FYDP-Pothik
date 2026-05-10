"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const routes = [
  {
    from: "Dhaka",
    to: "Cox's Bazar",
    duration: "10h",
    fromPrice: 1200,
    image:
      "https://images.unsplash.com/photo-1558025137-a04e8a6f33dc?auto=format&fit=crop&w=1200&q=80",
    tag: "Most loved",
  },
  {
    from: "Dhaka",
    to: "Sylhet",
    duration: "6h",
    fromPrice: 700,
    image:
      "https://images.unsplash.com/photo-1605543667606-52b0f1ee1b72?auto=format&fit=crop&w=1200&q=80",
    tag: "Tea country",
  },
  {
    from: "Dhaka",
    to: "Chittagong",
    duration: "6h",
    fromPrice: 800,
    image:
      "https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?auto=format&fit=crop&w=1200&q=80",
    tag: "Port city",
  },
  {
    from: "Dhaka",
    to: "Rajshahi",
    duration: "5h",
    fromPrice: 650,
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    tag: "Silk route",
  },
  {
    from: "Dhaka",
    to: "Khulna",
    duration: "7h",
    fromPrice: 750,
    image:
      "https://images.unsplash.com/photo-1591201570856-0b8d1ee46e93?auto=format&fit=crop&w=1200&q=80",
    tag: "Sundarbans",
  },
  {
    from: "Chittagong",
    to: "Cox's Bazar",
    duration: "4h",
    fromPrice: 500,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tag: "Beach run",
  },
];

export default function PopularRoutes() {
  return (
    <section className="container-padded py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="section-subtitle">Most-booked routes</span>
          <h2 className="section-title mt-3">
            Where Bangladesh is going this week
          </h2>
        </div>
        <Link
          href="/routes"
          className="btn-ghost group"
        >
          View all routes
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((r, i) => (
          <motion.div
            key={`${r.from}-${r.to}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Link
              href={`/search?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}
              className="group block overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={r.image}
                  alt={`${r.from} to ${r.to}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-900/30 to-transparent" />
                <span className="absolute top-4 left-4 badge bg-white/90 text-ink-900 backdrop-blur">
                  {r.tag}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-90">
                    <MapPin className="h-3.5 w-3.5" />
                    Bangladesh
                  </div>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <div className="font-display text-xl font-bold leading-tight">
                      {r.from} <span className="text-brand-300">→</span> {r.to}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <Clock className="h-4 w-4 text-brand-500" />
                  <span>~{r.duration} ride</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">
                    From
                  </div>
                  <div className="font-display text-lg font-bold text-brand-700">
                    {formatPrice(r.fromPrice)}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
