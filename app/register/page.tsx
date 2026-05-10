"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Bus, Mail, Lock, User, Phone, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    const signed = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (signed?.ok) {
      toast.success("Welcome to Pothik!");
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80)",
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
              Join 50K+ travellers
              <br /> who skipped the queue.
            </h2>
            <p className="mt-4 text-brand-200 max-w-md">
              Create a free account to unlock instant booking, saved trips, and
              one-tap rebooking on your favourite routes.
            </p>
          </div>
          <p className="text-xs text-brand-300">
            © {new Date().getFullYear()} Pothik
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
            Create your account
          </h1>
          <p className="mt-2 text-ink-600">
            Already have one?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-700 hover:underline"
            >
              Log in
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Input
              icon={<User className="h-4 w-4" />}
              label="Full name"
              type="text"
              required
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Jane Doe"
            />
            <Input
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="you@example.com"
            />
            <Input
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="01700000000"
            />
            <Input
              icon={<Lock className="h-4 w-4" />}
              label="Password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              placeholder="At least 6 characters"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                </>
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-500">
            By creating an account, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}

function Input({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-700">{label}</label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
          {icon}
        </span>
        <input
          type={type}
          required={required}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field !pl-10"
        />
      </div>
    </div>
  );
}
