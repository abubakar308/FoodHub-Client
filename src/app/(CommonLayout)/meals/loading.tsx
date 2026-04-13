import { MealCardSkeleton } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-48 rounded-lg" />
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <Skeleton className="h-12 w-full md:max-w-md rounded-full" />
        <div className="flex gap-2">
            <Skeleton className="h-12 w-32 rounded-full" />
            <Skeleton className="h-12 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <Skeleton className="h-6 w-24 rounded-md" />
            <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full rounded-md" />
                ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <Skeleton className="h-6 w-32 rounded-md" />
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full rounded-md" />
                ))}
            </div>
          </div>
        </aside>

        <div>
           <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <MealCardSkeleton key={i} />
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
