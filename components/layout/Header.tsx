"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bus, Menu, X, User, LogOut, LayoutDashboard, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Find Buses" },
  { href: "/routes", label: "Routes" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-ink-100 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-padded flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Pothik home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow transition-transform group-hover:scale-110">
            <Bus className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink-900">
            Pothik
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-ink-600 rounded-lg transition-colors hover:text-brand-700 hover:bg-brand-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-1.5 hover:border-brand-300 transition-colors"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="text-sm font-medium text-ink-700 max-w-[100px] truncate">
                  {session.user?.name}
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-ink-100 bg-white shadow-xl py-1 animate-slide-down"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-brand-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-brand-50"
                  >
                    <Ticket className="h-4 w-4" />
                    My Bookings
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-brand-50"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <div className="my-1 border-t border-ink-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((s) => !s)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-lg hover:bg-ink-100"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ink-100 bg-white animate-slide-down">
          <div className="container-padded py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-ink-100 flex gap-2">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-secondary flex-1"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-secondary flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
