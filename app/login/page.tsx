"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Bus, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-screen grid place-items-center">
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const explicitCallback = params.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      // Look up the role from the session to decide where to land.
      // If the user came from a protected page, honour that callbackUrl.
      let target = explicitCallback ?? "/dashboard";
      if (!explicitCallback) {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json().catch(() => null);
        if (session?.user?.role === "ADMIN") target = "/admin";
      }
      setLoading(false);
      toast.success("Welcome back!");
      router.push(target);
      router.refresh();
    } else {
      setLoading(false);
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 via-brand-800/75 to-ink-950/95" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20">
              <Bus className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold">Pothik</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">
              Pick your seat,
              <br />
              own your journey.
            </h2>
            <p className="mt-4 text-brand-200 max-w-md">
              Log in to see your trips, manage upcoming bookings, and rebook
              your favourite routes in seconds.
            </p>
          </div>
          <p className="text-xs text-brand-300">
            © {new Date().getFullYear()} Pothik. Built with care.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700">
              <Bus className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-xl font-bold text-ink-900">
              Pothik
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Welcome back
          </h1>
          <p className="mt-2 text-ink-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-brand-700 hover:underline"
            >
              Sign up free
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field !pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field !pl-10"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-500">
            By signing in, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
