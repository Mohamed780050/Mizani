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
    <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-border/50 touch-auto">
        <div className="min-w-[500px] relative">
          {/* Sticky header */}
          <div className="sticky top-0 z-20 border-b border-border/50 bg-secondary/95 backdrop-blur-md">
            <div className="grid grid-cols-4 px-5 py-4">
              <span className="text-start font-bold text-xs uppercase tracking-wider text-muted-foreground text-nowrap">
                {labels.periodUnit}
              </span>
              <span className="text-end font-bold text-xs uppercase tracking-wider text-muted-foreground text-nowrap">
                {labels.startBalance}
              </span>
              <span className="text-end font-bold text-xs uppercase tracking-wider text-muted-foreground text-nowrap">
                {labels.interest}
              </span>
              <span className="text-end font-bold text-xs uppercase tracking-wider text-muted-foreground text-nowrap">
                {labels.endBalance}
              </span>
            </div>
          </div>

          {/* Table body */}
          <div className="divide-y divide-border/30">
            {data.map((row) => (
              <div
                key={row.period}
                className="grid grid-cols-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors"
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
      </div>
    </div>
  );
}
