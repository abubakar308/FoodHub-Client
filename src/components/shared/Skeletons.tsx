import { Skeleton } from "@/components/ui/skeleton";

export function MealCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center gap-4">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="pt-4 flex items-center justify-between">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-32 rounded-[28px] border border-border bg-card p-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <Skeleton className="h-4 w-16 rounded-md" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-muted/50 p-4 border-b border-border">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1 rounded-md" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4 flex gap-4">
              {Array.from({ length: cols }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-3 w-32 rounded-full" />
        </div>
      ))}
    </div>
  );
}
