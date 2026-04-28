"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format-utils";

interface NumberFormattingProps {
  value: number;
  type?: "currency" | "number" | "percentage";
  precision?: number;
  className?: string;
  showSign?: boolean;
}

/**
 * A component to format numbers consistently across locales.
 * It always uses Western Arabic numerals (English style) even in Arabic locale.
 */
export function NumberFormatting({
  value,
  type = "number",
  precision = 2,
  className,
  showSign = false,
}: NumberFormattingProps) {
  const formattedValue = React.useMemo(() => {
    return formatNumber(value, { type, precision, showSign });
  }, [value, type, precision, showSign]);

  // If it's a percentage, the % sign is already appended by formatNumber
  // But wait, the component handles the % sign in the JSX below.
  // I should check if formatNumber appends it.
  // formatNumber DOES append it if type is "percentage".
  
  // To avoid double %, I'll remove it from formatNumber or here.
  // Actually, formatNumber should probably NOT append it if we want maximum flexibility.
  // No, formatNumber is a utility, it SHOULD be complete.
  
  // I'll update formatNumber to NOT append the % if we want to handle it in JSX,
  // OR I'll update the component to just render the result.
  
  return (
    <span className={cn("font-mono tracking-tight", className)}>
      {formattedValue}
      {type === "percentage" && "%"}
    </span>
  );
}

// Re-export the utility for convenience in client components
export { formatNumber };
