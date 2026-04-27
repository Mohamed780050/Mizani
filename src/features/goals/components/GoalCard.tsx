"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Target, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fundGoalAction } from "../actions/goal-actions";

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  isCompleted: boolean;
};

export function GoalCard({
  goal,
  currentSavings,
}: {
  goal: Goal;
  currentSavings: number;
}) {
  const t = useTranslations("Goals");
  const td = useTranslations("Dashboard");
  const percentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100,
  );
  const [fundingAmount, setFundingAmount] = useState<number | "">("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleFund = () => {
    if (!fundingAmount || fundingAmount <= 0) return;
    setError("");

    if (fundingAmount > currentSavings) {
      setError(t("errorInsufficient"));
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          goalId: goal.id,
          amount: Number(fundingAmount),
        }),
      );
      const res = await fundGoalAction(null, fd);
      if (res.success) {
        setFundingAmount("");
      } else {
        setError(res.error || t("errorDefault"));
      }
    });
  };

  return (
    <div className="bg-card border border-border/50 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative rounded-[2.5rem]">
      {goal.isCompleted && (
        <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center border-2 border-emerald-500/20 rounded-[2.5rem]">
          <div className="size-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-3 animate-in zoom-in">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="font-black text-emerald-700 dark:text-emerald-400 text-lg">
            {t("achieved")}
          </h3>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Target className="size-6" />
          </div>
          {goal.deadline && (
            <div className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase bg-secondary/50 px-3 py-1 rounded-full">
              🎯 {new Date(goal.deadline).toLocaleDateString()}
            </div>
          )}
        </div>

        <h3 className="font-extrabold tracking-tight text-xl mb-1 truncate">
          {goal.title}
        </h3>
        <div className="flex items-baseline space-x-1 mb-6">
          <span className="font-bold text-muted-foreground text-xs">{td("currency")}</span>
          <span className="font-mono font-black text-xl sm:text-2xl tracking-tighter">
            {Number(goal.currentAmount).toLocaleString()}
          </span>
          <span className="text-muted-foreground/50 font-bold mx-1">/</span>
          <span className="font-mono font-bold text-muted-foreground text-sm sm:text-base">
            {Number(goal.targetAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>{t("progress")}</span>
            <span className="text-foreground">{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {error && (
          <div className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 relative z-20">
          <Input
            type="number"
            placeholder={t("inject")}
            className="bg-secondary/40 border-none font-bold placeholder:text-muted-foreground/50 rounded-xl"
            value={fundingAmount}
            onChange={(e) => setFundingAmount(Number(e.target.value))}
            disabled={goal.isCompleted || isPending}
          />
          <Button
            size="icon"
            className="rounded-xl shrink-0 bg-primary hover:bg-primary/90 transition-transform active:scale-95"
            disabled={goal.isCompleted || isPending || !fundingAmount}
            onClick={handleFund}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ChevronRight className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
