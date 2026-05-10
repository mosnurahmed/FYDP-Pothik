import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LayoutDashboard, Compass, Bus, ShieldCheck } from "lucide-react";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tour packages", icon: Compass },
  { href: "/admin/fleet", label: "Bus fleet", icon: Bus },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/login?callbackUrl=/admin");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 bg-ink-50/40">
        <div className="container-padded py-10">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="space-y-1">
              <div className="rounded-2xl border border-ink-100 bg-gradient-to-br from-brand-700 to-brand-900 text-white p-4 shadow-soft mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-300" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-200">
                    Admin
                  </span>
                </div>
                <div className="mt-2 font-semibold truncate">{session.name}</div>
                <div className="text-xs text-brand-200 truncate">
                  {session.email}
                </div>
              </div>
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-white hover:text-brand-700 hover:shadow-soft"
                >
                  <it.icon className="h-4 w-4" />
                  {it.label}
                </Link>
              ))}
            </aside>
            <div>{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
