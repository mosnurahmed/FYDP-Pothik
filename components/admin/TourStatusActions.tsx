"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Globe, Archive, Ban, Trash2 } from "lucide-react";

export default function TourStatusActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const change = (newStatus: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/tours/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Couldn't change status");
        return;
      }
      toast.success(`Status changed to ${newStatus}`);
      router.refresh();
    });
  };

  const remove = () => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Delete failed");
        return;
      }
      toast.success("Tour deleted");
      router.push("/admin/tours");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isPending && (
        <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
      )}
      {status === "DRAFT" && (
        <button onClick={() => change("PUBLISHED")} className="btn-primary">
          <Globe className="h-4 w-4" /> Publish
        </button>
      )}
      {status === "PUBLISHED" && (
        <button
          onClick={() => change("CLOSED")}
          className="btn-secondary"
        >
          <Archive className="h-4 w-4" /> Close bookings
        </button>
      )}
      {(status === "DRAFT" || status === "PUBLISHED" || status === "CLOSED") && (
        <button onClick={() => change("CANCELLED")} className="btn-secondary">
          <Ban className="h-4 w-4" /> Cancel tour
        </button>
      )}
      <button
        onClick={remove}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  );
}
