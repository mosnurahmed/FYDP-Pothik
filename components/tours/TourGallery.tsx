"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function TourGallery({
  cover,
  gallery,
  alt,
}: {
  cover: string;
  gallery: string[];
  alt: string;
}) {
  const allImages = [cover, ...gallery.filter((g) => g !== cover)];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink-100">
        <Image
          key={active}
          src={allImages[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover animate-fade-in"
        />
      </div>
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl ring-2 transition-all",
                i === active
                  ? "ring-brand-500 ring-offset-2"
                  : "ring-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
