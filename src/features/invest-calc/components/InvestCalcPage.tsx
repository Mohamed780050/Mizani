"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, Coins, Percent, Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { NumberFormatting } from "@/components/ui/NumberFormatting";
import { FrequencyToggle } from "./FrequencyToggle";
import { GrowthChart, type PeriodData } from "./GrowthChart";
import { BreakdownTable } from "./BreakdownTable";

type Frequency = "monthly" | "yearly";

/**
 * Compute compound interest period-by-period.
 *
 * If frequency === "yearly":
 *   Each period = 1 year, rate per period = roiPercent/100
 *   duration = number of years
 *
 * If frequency === "monthly":
 *   Each period = 1 month, rate per period = (roiPercent/100)/12
 *   duration = number of months
 */
function computeBreakdown(
  principal: number,
  roiPercent: number,
  frequency: Frequency,
  duration: number
): PeriodData[] {
  if (principal <= 0 || roiPercent <= 0 || duration <= 0) return [];

  const ratePerPeriod =
    frequency === "yearly"
      ? roiPercent / 100
      : roiPercent / 100 / 12;

  const periods: PeriodData[] = [];
  let balance = principal;

  for (let i = 1; i <= duration; i++) {
    const startBalance = balance;
    const interest = startBalance * ratePerPeriod;
    balance = startBalance + interest;

    periods.push({
      period: i,
      startBalance,
      interest,
      endBalance: balance,
    });
  }

  return periods;
}

export function InvestCalcPage() {
  const t = useTranslations("InvestCalc");

  // State
  const [principal, setPrincipal] = useState<number | "">(10000);
  const [roiPercent, setRoiPercent] = useState<number>(10);
  const [frequency, setFrequency] = useState<Frequency>("yearly");
  const [duration, setDuration] = useState<number | "">(5);

  // Derived data
  const breakdown = useMemo(
    () =>
      computeBreakdown(
        Number(principal) || 0,
        roiPercent,
        frequency,
        Number(duration) || 0
      ),
    [principal, roiPercent, frequency, duration]
  );

  const totalValue = breakdown.length > 0 ? breakdown[breakdown.length - 1].endBalance : 0;
  const totalProfit = totalValue - (Number(principal) || 0);
  const profitPercent =
    Number(principal) > 0 ? (totalProfit / Number(principal)) * 100 : 0;

  const periodLabel = frequency === "yearly" ? t("year") : t("month");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 w-full pt-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
          {t("title")}
        </h1>
        <p className="text-muted-foreground font-medium max-w-xl">
          {t("description")}
        </p>
      </div>

      {/* ──── TOP: Summary Cards (full width) ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Value */}
        <div className="bg-card border border-border/50 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -top-8 -inset-e-8 size-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {t("totalValue")}
          </p>
          <p className="font-mono font-black text-2xl sm:text-3xl tracking-tighter text-foreground">
            <NumberFormatting value={totalValue} />
          </p>
        </div>

        {/* Total Profit */}
        <div className="bg-card border border-border/50 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -top-8 -inset-e-8 size-20 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {t("totalProfit")}
          </p>
          <p className="font-mono font-black text-2xl sm:text-3xl tracking-tighter text-emerald-600 dark:text-emerald-400">
            +<NumberFormatting value={totalProfit} />
          </p>
        </div>

        {/* ROI % */}
        <div className="bg-card border border-border/50 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -top-8 -inset-e-8 size-20 bg-teal-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="size-3" />
            {t("profitPercent")}
          </p>
          <p className="font-mono font-black text-2xl sm:text-3xl tracking-tighter text-amber-600 dark:text-amber-400">
            <NumberFormatting value={profitPercent} precision={1} />%
          </p>
        </div>
      </div>

      {/* ──── Growth Chart (full width) ──── */}
      {breakdown.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ms-1 flex items-center gap-1.5">
            <TrendingUp className="size-4" />
            {t("growthChart")}
          </h2>
          <GrowthChart
            data={breakdown}
            periodLabel={periodLabel}
          />
        </div>
      )}

      {/* ──── BOTTOM: Input Card + Breakdown Table side by side ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Card */}
        <div className="lg:col-span-5 bg-card border border-border/50 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-7 relative overflow-hidden h-fit">
          {/* Ambient glow */}
          <div className="absolute -top-20 -inset-e-20 size-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -inset-s-16 size-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Initial Capital */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1 flex items-center gap-1.5">
              <Coins className="size-3.5" />
              {t("initialInvestment")}
            </label>
            <div className="relative">
              <Input
                id="invest-calc-principal"
                type="number"
                min="0"
                step="100"
                value={principal}
                onChange={(e) =>
                  setPrincipal(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="10,000"
                className="bg-secondary/40 border-none shadow-sm rounded-xl py-6 ps-5 font-black text-xl text-foreground font-mono"
              />
            </div>
          </div>

          {/* ROI Percent */}
          <div className="space-y-3 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1 flex items-center gap-1.5">
              <Percent className="size-3.5" />
              {t("roiPercent")}
            </label>
            <div className="flex items-center gap-4">
              <Slider
                id="invest-calc-roi-slider"
                value={[roiPercent]}
                onValueChange={([v]) => setRoiPercent(v)}
                min={1}
                max={100}
                step={0.5}
                className="flex-1 **:data-[slot=slider-track]:h-2 **:data-[slot=slider-range]:bg-linear-to-r **:data-[slot=slider-range]:from-emerald-500 **:data-[slot=slider-range]:to-amber-500 **:data-[slot=slider-thumb]:size-5 **:data-[slot=slider-thumb]:border-2"
              />
              <div className="relative shrink-0 w-20">
                <Input
                  id="invest-calc-roi-input"
                  type="number"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={roiPercent}
                  onChange={(e) =>
                    setRoiPercent(
                      Math.min(100, Math.max(0.5, Number(e.target.value) || 0.5))
                    )
                  }
                  className="bg-secondary/40 border-none shadow-sm rounded-xl py-3 text-center font-black text-foreground font-mono"
                />
                <span className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 font-bold text-xs pointer-events-none">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Frequency Toggle */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1 flex items-center gap-1.5">
              <TrendingUp className="size-3.5" />
              {t("frequency")}
            </label>
            <FrequencyToggle
              value={frequency}
              onChange={(f) => {
                setFrequency(f);
                // Reset duration to a sensible default when switching
                if (f === "monthly" && (Number(duration) || 0) <= 10) {
                  setDuration(12);
                } else if (f === "yearly" && (Number(duration) || 0) > 30) {
                  setDuration(5);
                }
              }}
              labels={{ monthly: t("monthly"), yearly: t("yearly") }}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1 flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {t("duration")}
            </label>
            <div className="relative">
              <Input
                id="invest-calc-duration"
                type="number"
                min="1"
                max={frequency === "yearly" ? 50 : 600}
                step="1"
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder={frequency === "yearly" ? "5" : "12"}
                className="bg-secondary/40 border-none shadow-sm rounded-xl py-6 ps-5 font-black text-xl text-foreground font-mono"
              />
              <span className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 font-bold text-sm pointer-events-none">
                {frequency === "yearly" ? t("years") : t("months")}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        {breakdown.length > 0 && (
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ms-1">
              {t("breakdown")}
            </h2>
            <BreakdownTable
              data={breakdown}
              labels={{
                period: t("period"),
                periodUnit: periodLabel,
                startBalance: t("startBalance"),
                interest: t("interest"),
                endBalance: t("endBalance"),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
