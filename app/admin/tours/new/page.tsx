import TourBuilder from "@/components/admin/TourBuilder";

export const dynamic = "force-dynamic";

export default function NewTourPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          New tour package
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          Set up the tour, sightseeing spots, and pickup points. You can save
          as draft and publish later.
        </p>
      </div>
      <TourBuilder mode="create" />
    </div>
  );
}
