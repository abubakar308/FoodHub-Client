import { MealCardSkeleton } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-16 space-y-4 text-center">
        <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
        <Skeleton className="h-5 w-96 mx-auto rounded-lg" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MealCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
