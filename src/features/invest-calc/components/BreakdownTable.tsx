"use client";

import React from "react";
import { NumberFormatting } from "@/components/ui/NumberFormatting";
import type { PeriodData } from "./GrowthChart";

interface BreakdownTableProps {
  data: PeriodData[];
  labels: {
    period: string;
    periodUnit: string;
    startBalance: string;
    interest: string;
    endBalance: string;
  };
}

export function BreakdownTable({ data, labels }: BreakdownTableProps) {
  if (data.length === 0) return null;

  return (
    <div className="bg-card border border-border/50 rounded-3xl shadow-sm">
      {/* Sticky header */}
      <div className="border-b border-border/50 bg-secondary/30 rounded-t-3xl">
        <div className="grid grid-cols-4 px-5 py-4">
          <span className="text-start font-bold text-xs uppercase tracking-wider text-muted-foreground">
            {labels.periodUnit}
          </span>
          <span className="text-end font-bold text-xs uppercase tracking-wider text-muted-foreground">
            {labels.startBalance}
          </span>
          <span className="text-end font-bold text-xs uppercase tracking-wider text-muted-foreground">
            {labels.interest}
          </span>
          <span className="text-end font-bold text-xs uppercase tracking-wider text-muted-foreground">
            {labels.endBalance}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="max-h-[420px] overflow-y-auto overscroll-contain rounded-b-3xl">
        {data.map((row) => (
          <div
            key={row.period}
            className="grid grid-cols-4 px-5 py-3.5 border-b border-border/30 last:border-none hover:bg-secondary/20 transition-colors"
          >
            <div className="text-start">
              <span className="inline-flex items-center justify-center size-7 rounded-lg bg-secondary/50 text-xs font-black tabular-nums">
                {row.period}
              </span>
            </div>
            <div className="text-end font-mono font-semibold text-muted-foreground tabular-nums text-sm">
              <NumberFormatting value={row.startBalance} />
            </div>
            <div className="text-end font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
              +<NumberFormatting value={row.interest} />
            </div>
            <div className="text-end font-mono font-black text-foreground tabular-nums text-sm">
              <NumberFormatting value={row.endBalance} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
