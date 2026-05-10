import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20 grid place-items-center">
        <div className="container-padded py-20 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-brand-600">
            <Compass className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold text-ink-900">
            Lost the map?
          </h1>
          <p className="mt-3 text-ink-600 max-w-md mx-auto">
            We couldn't find that page. Let's get you back on the road.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Go home
            </Link>
            <Link href="/search" className="btn-secondary">
              Find buses
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
