"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bus, Menu, X, User, LogOut, LayoutDashboard, Ticket, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About" },
];

type HeaderProps = {
  /**
   * When true, the header is transparent at the top of the page and
   * fades to a solid background on scroll. Use on pages with a dark hero.
   * When false, the header is always solid.
   */
  transparentOnTop?: boolean;
};

export default function Header({ transparentOnTop = false }: HeaderProps) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparentOnTop) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-ink-100 shadow-sm"
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
          <span
            className={cn(
              "font-display text-xl font-bold tracking-tight transition-colors",
              scrolled ? "text-ink-900" : "text-white drop-shadow-sm"
            )}
          >
            Pothik
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                scrolled
                  ? "text-ink-700 hover:text-brand-700 hover:bg-brand-50"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              )}
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
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-colors",
                  scrolled
                    ? "border-ink-200 bg-white hover:border-brand-300"
                    : "border-white/30 bg-white/10 backdrop-blur hover:bg-white/20"
                )}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium max-w-[100px] truncate",
                    scrolled ? "text-ink-700" : "text-white"
                  )}
                >
                  {session.user?.name}
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-ink-100 bg-white shadow-xl py-1 animate-slide-down"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {(session.user as any)?.role === "ADMIN" && (
                    <>
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin panel
                      </Link>
                      <div className="my-1 border-t border-ink-100" />
                    </>
                  )}
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
                    My Tours
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
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                  scrolled
                    ? "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
                    : "text-white hover:bg-white/10"
                )}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  scrolled
                    ? "bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-glow"
                    : "bg-white text-brand-700 shadow-md hover:bg-brand-50"
                )}
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((s) => !s)}
          className={cn(
            "md:hidden grid h-10 w-10 place-items-center rounded-lg transition-colors",
            scrolled
              ? "text-ink-900 hover:bg-ink-100"
              : "text-white hover:bg-white/10"
          )}
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
