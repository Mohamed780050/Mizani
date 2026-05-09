"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { NumberFormatting } from "@/components/ui/NumberFormatting";

export interface PeriodData {
  period: number;
  startBalance: number;
  interest: number;
  endBalance: number;
}

interface GrowthChartProps {
  data: PeriodData[];
  periodLabel: string;
  className?: string;
}

export function GrowthChart({ data, periodLabel, className }: GrowthChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.endBalance));

  // Smart sampling: show max ~30 bars, evenly spaced
  const maxBars = 30;
  const displayData =
    data.length <= maxBars
      ? data
      : data.filter((_, i) => {
          const step = Math.ceil(data.length / maxBars);
          return i % step === 0 || i === data.length - 1;
        });

  // Decide which bars get x-axis labels (max ~8 labels)
  const maxLabels = 8;
  const labelStep = Math.max(1, Math.ceil(displayData.length / maxLabels));

  return (
    <div className={cn("", className)}>
      {/* Wrapper with no overflow-hidden so tooltip can escape */}
      <div className="relative bg-secondary/30 rounded-3xl pt-14 pb-10 px-5 sm:px-8">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-5 top-14 bottom-10 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-border/30" />
          ))}
        </div>

        {/* Bars container */}
        <div
          className="relative flex items-end"
          style={{
            height: "clamp(180px, 28vw, 280px)",
            gap: displayData.length > 20 ? "3px" : "8px",
          }}
        >
          {displayData.map((d, i) => {
            const heightPercent = maxValue > 0 ? (d.endBalance / maxValue) * 100 : 0;
            const progress = displayData.length > 1 ? i / (displayData.length - 1) : 0;
            const isHovered = hoveredIndex === i;
            const showLabel =
              i === 0 ||
              i === displayData.length - 1 ||
              i % labelStep === 0;

            return (
              <div
                key={d.period}
                className="flex-1 flex flex-col items-center justify-end relative"
                style={{ height: "100%" }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip — positioned above the chart area */}
                {isHovered && (
                  <div
                    className="absolute z-30 pointer-events-none"
                    style={{
                      bottom: `calc(${Math.max(heightPercent, 5)}% + 12px)`,
                      left: "50%",
                      transform: `translateX(${
                        i < 2 ? "0%" : i >= displayData.length - 2 ? "-100%" : "-50%"
                      })`,
                    }}
                  >
                    <div className="bg-card shadow-lg rounded-xl px-3.5 py-2.5 border border-border/50 text-center whitespace-nowrap">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {periodLabel} {d.period}
                      </p>
                      <p className="text-sm font-black font-mono tracking-tight">
                        <NumberFormatting value={d.endBalance} />
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        +<NumberFormatting value={d.interest} />
                      </p>
                    </div>
                  </div>
                )}

                {/* Bar */}
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-300 ease-out cursor-pointer relative overflow-hidden min-h-[3px]",
                    isHovered && "brightness-125"
                  )}
                  style={{
                    height: `${Math.max(heightPercent, 2)}%`,
                    background: `linear-gradient(to top, hsl(${170 - progress * 30}, ${70 - progress * 15}%, ${35 + progress * 10}%), hsl(${170 - progress * 40}, ${65 - progress * 10}%, ${45 + progress * 15}%))`,
                  }}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-linear-to-t from-transparent via-white/10 to-white/25 transition-opacity",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>

                {/* Period label below the bar */}
                <div className="h-7 flex items-end justify-center">
                  {showLabel && (
                    <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground tabular-nums leading-none">
                      {d.period}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
