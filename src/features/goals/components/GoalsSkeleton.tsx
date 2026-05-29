import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function GoalsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Bar Skeleton */}
      <Skeleton className="h-24 w-full rounded-[2rem]" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  );
}
