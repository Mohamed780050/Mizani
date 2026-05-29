"use client";

import React, { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBudgetAction } from "../actions/budget-actions";
import { NumberFormatting } from "@/components/ui/NumberFormatting";
import type { BudgetEntry } from "@/features/budgets/actions/queries";

export function BudgetCard({ budget }: { budget: BudgetEntry }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Budget");
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
  const isOver80 = percentage >= 80;
  const isOver100 = percentage >= 100;

  const handleDelete = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("data", JSON.stringify({ budgetId: budget.id }));
      await deleteBudgetAction(null, fd);
    });
  };

  return (
    <div className="bg-card rounded-[32px] border border-border/50 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="size-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {budget.category.emoji}
          </div>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="size-9 rounded-xl bg-secondary/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        </div>

        <h3 className="font-extrabold tracking-tight text-lg mb-1">
          {budget.category.name}
        </h3>
        <div className="flex items-baseline gap-1.5 mb-6">
          <span
            className={`font-mono font-black text-2xl tracking-tighter ${
              isOver100
                ? "text-rose-600"
                : isOver80
                  ? "text-amber-600"
                  : "text-foreground"
            }`}
          >
            <NumberFormatting value={budget.spent} />
          </span>
          <span className="text-muted-foreground/50 font-bold mx-0.5">/</span>
          <span className="font-mono font-bold text-muted-foreground">
            <NumberFormatting value={budget.limit} />
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>{t("consumed")}</span>
          <span
            className={
              isOver100
                ? "text-rose-600"
                : isOver80
                  ? "text-amber-600"
                  : "text-foreground"
            }
          >
            <NumberFormatting value={percentage} precision={1} />%
          </span>
        </div>
        <Progress
          value={percentage}
          className={`h-3 ${
            isOver100
              ? "[&>div]:bg-rose-500"
              : isOver80
                ? "[&>div]:bg-amber-500"
                : ""
          }`}
        />
      </div>
    </div>
  );
}
