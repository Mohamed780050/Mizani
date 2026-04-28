import React from "react";
import { Skeleton } from "@/app/[locale]/(protected)/dashboard/components/Skeletons";

export function GoalsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Bar Skeleton */}
      <div className="h-24 w-full bg-secondary/30 animate-pulse rounded-[2rem]" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-secondary/20 animate-pulse rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  );
}
