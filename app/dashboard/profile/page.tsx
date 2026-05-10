import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Your profile
        </h1>
        <p className="text-ink-600 text-sm mt-1">Your account at a glance.</p>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-2xl font-bold shadow-glow">
            {user.name[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-display text-xl font-bold text-ink-900">
              {user.name}
            </div>
            <div className="text-sm text-ink-500">
              Pothik member since {formatDate(user.createdAt)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field
            icon={<User className="h-4 w-4" />}
            label="Full name"
            value={user.name}
          />
          <Field
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={user.email}
          />
          <Field
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={user.phone ?? "Not added"}
          />
          <Field
            icon={<Calendar className="h-4 w-4" />}
            label="Member since"
            value={formatDate(user.createdAt)}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 font-medium text-ink-900">{value}</div>
    </div>
  );
}
