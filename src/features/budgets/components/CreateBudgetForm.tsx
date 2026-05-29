"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Coins, Loader2 } from "lucide-react";
import { upsertBudgetAction } from "../actions/budget-actions";
import type { CategoryOption } from "@/features/budgets/actions/queries";

export function CreateBudgetForm({
  categories,
  month,
  year,
  onSuccess,
}: {
  categories: CategoryOption[];
  month: number;
  year: number;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState<number | "">("");
  const [error, setError] = useState("");
  const t = useTranslations("Budget");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !limit || limit <= 0) return;
    setError("");

    startTransition(async () => {
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          categoryId,
          limit: Number(limit),
          month,
          year,
        }),
      );
      const res = await upsertBudgetAction(null, fd);
      if (res.success) {
        onSuccess();
      } else {
        if (res.error === "BUDGET_LIMIT") {
          setError(t("errorLimit"));
        } else {
          setError(res.error || t("errorDefault"));
        }
      }
    });
  };

  return (
    <>
      <SheetHeader className="text-start space-y-2 pt-6">
        <SheetTitle className="text-2xl font-black tracking-tight text-amber-950 dark:text-amber-50">
          {t("newTitle")}
        </SheetTitle>
        <SheetDescription className="text-muted-foreground">
          {t("newDesc")}
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-2xl border border-destructive/20 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
            {t("categoryLabel")}
          </label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full bg-card border-none rounded-xl py-6 shadow-sm">
              <SelectValue placeholder={t("categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2 font-medium">
                    <span>{c.emoji}</span>
                    <span>{c.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
            {t("limitLabel")}
          </label>
          <div className="relative">
            <Coins className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              placeholder="0.00"
              required
              className="bg-card border-none shadow-sm rounded-xl py-6 pl-12 rtl:pl-4 rtl:pr-12 font-black text-xl text-amber-600 dark:text-amber-400 font-mono"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("periodLabel")}
          </p>
          <p className="font-bold mt-1 text-foreground">
            {new Date(year, month - 1).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-7 bg-amber-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            t("saveButton")
          )}
        </Button>
      </form>
    </>
  );
}
