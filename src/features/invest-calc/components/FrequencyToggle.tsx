"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Frequency = "monthly" | "yearly";

interface FrequencyToggleProps {
  value: Frequency;
  onChange: (value: Frequency) => void;
  labels: { monthly: string; yearly: string };
}

export function FrequencyToggle({ value, onChange, labels }: FrequencyToggleProps) {
  return (
    <div className="relative flex bg-secondary/60 rounded-2xl p-1.5 gap-1">
      {/* Sliding indicator */}
      <div
        className={cn(
          "absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-card shadow-md transition-all duration-300 ease-out",
          value === "yearly"
            ? "translate-x-[calc(100%+0.25rem)]"
            : "translate-x-0"
        )}
      />

      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "relative z-10 flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors duration-200",
          value === "monthly"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground/70"
        )}
      >
        {labels.monthly}
      </button>

      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={cn(
          "relative z-10 flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors duration-200",
          value === "yearly"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground/70"
        )}
      >
        {labels.yearly}
      </button>
    </div>
  );
}
