import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function BudgetsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Bar Skeleton */}
      <div className="flex items-center justify-between bg-card border border-border/50 p-4 sm:p-6 rounded-3xl shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-20" />
        </div>
        <Skeleton className="h-12 w-12 sm:h-12 sm:w-36 rounded-full" />
      </div>

      {/* Budget Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card rounded-[32px] border border-border/50 p-6 shadow-sm space-y-4"
          >
            {/* Header: emoji icon + delete button */}
            <div className="flex items-center justify-between">
              <Skeleton className="size-12 rounded-2xl" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
            {/* Title */}
            <Skeleton className="h-5 w-32" />
            {/* Amount row */}
            <div className="flex items-baseline gap-1.5">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            {/* Progress bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
