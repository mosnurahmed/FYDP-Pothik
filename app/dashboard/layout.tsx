import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LayoutDashboard, Ticket, User } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My Bookings", icon: Ticket },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/dashboard");

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 bg-ink-50/40">
        <div className="container-padded py-10">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="space-y-1">
              <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft mb-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="mt-3 font-semibold text-ink-900 truncate">
                  {session.user?.name}
                </div>
                <div className="text-xs text-ink-500 truncate">
                  {session.user?.email}
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
