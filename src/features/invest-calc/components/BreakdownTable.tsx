"use client";

import React from "react";
import { NumberFormatting } from "@/components/ui/NumberFormatting";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
      <ScrollArea className="max-h-[420px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/30 sticky top-0 z-10 backdrop-blur-sm">
              <th className="text-start px-5 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                {labels.periodUnit}
              </th>
              <th className="text-end px-5 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                {labels.startBalance}
              </th>
              <th className="text-end px-5 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                {labels.interest}
              </th>
              <th className="text-end px-5 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                {labels.endBalance}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.period}
                className="border-b border-border/30 last:border-none hover:bg-secondary/20 transition-colors"
              >
                <td className="px-5 py-3.5 font-bold text-foreground">
                  <span className="inline-flex items-center justify-center size-7 rounded-lg bg-secondary/50 text-xs font-black tabular-nums">
                    {row.period}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-end font-mono font-semibold text-muted-foreground tabular-nums">
                  <NumberFormatting value={row.startBalance} />
                </td>
                <td className="px-5 py-3.5 text-end font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +<NumberFormatting value={row.interest} />
                </td>
                <td className="px-5 py-3.5 text-end font-mono font-black text-foreground tabular-nums">
                  <NumberFormatting value={row.endBalance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
