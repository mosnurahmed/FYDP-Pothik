import Link from "next/link";
import { Bus, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-950 text-ink-300">
      <div className="container-padded py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
                <Bus className="h-5 w-5 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl font-bold text-white">Pothik</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              The smart way to book bus tickets across Bangladesh. Real-time seats,
              transparent prices, zero hassle.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Github, label: "Github" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-ink-300 transition-colors hover:bg-brand-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/search" className="hover:text-brand-300">Find Buses</Link></li>
              <li><Link href="/routes" className="hover:text-brand-300">Popular Routes</Link></li>
              <li><Link href="/about" className="hover:text-brand-300">About Pothik</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-300">My Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="hover:text-brand-300">Help Center</Link></li>
              <li><Link href="#" className="hover:text-brand-300">Cancellation</Link></li>
              <li><Link href="#" className="hover:text-brand-300">Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-brand-300">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-400" />
                <span>Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <a href="tel:+8801700000000" className="hover:text-brand-300">
                  +880 1700 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <a href="mailto:hello@pothik.bd" className="hover:text-brand-300">
                  hello@pothik.bd
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Pothik. Crafted with care in Bangladesh.
          </p>
          <p className="text-xs text-ink-400">
            Built with Next.js · TypeScript · Tailwind · Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
