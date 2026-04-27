import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-secondary/50 rounded-2xl ${className}`} />
  );
}

export function NetWorthSkeleton() {
  return (
    <div className="h-64 w-full bg-emerald-900/20 animate-pulse rounded-[32px]" />
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-40 bg-secondary/30 animate-pulse rounded-[32px]" />
      ))}
    </div>
  );
}

export function LedgerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-secondary/30 animate-pulse rounded-lg" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-secondary/20 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
