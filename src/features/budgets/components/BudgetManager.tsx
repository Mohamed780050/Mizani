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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Trash2,
  Loader2,
  Coins,
  BarChart3,
} from "lucide-react";
import {
  upsertBudgetAction,
  deleteBudgetAction,
} from "../actions/budget-actions";
import { NumberFormatting } from "@/components/ui/NumberFormatting";

type Category = {
  id: string;
  name: string;
  emoji: string;
};

type BudgetEntry = {
  id: string;
  categoryId: string;
  limit: number;
  month: number;
  year: number;
  category: {
    name: string;
    emoji: string;
  };
  spent: number;
};

export function BudgetManager({
  budgets,
  categories,
}: {
  budgets: BudgetEntry[];
  categories: Category[];
}) {
  const [openCreate, setOpenCreate] = useState(false);
  const t = useTranslations("Budget");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="flex items-center justify-between bg-card border border-border/50 p-4 sm:p-6 rounded-3xl shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">
            {t("activeBudgets")}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-500">
              <NumberFormatting value={budgets.length} precision={0} />
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              {t("categories")}
            </span>
          </div>
        </div>

        <Sheet open={openCreate} onOpenChange={setOpenCreate}>
          <SheetTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full p-2.5 sm:px-6 sm:py-6 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform shrink-0">
              <Plus className="size-5 sm:me-2" />
              <span className="hidden sm:inline">{t("addBudget")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md bg-[#f7f9ff] dark:bg-[#080b0e] border-s-border/50 px-4">
            <CreateBudgetForm
              categories={categories}
              month={currentMonth}
              year={currentYear}
              onSuccess={() => setOpenCreate(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}

        {budgets.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[32px] text-center">
            <div className="size-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="size-8 text-amber-500 opacity-80" />
            </div>
            <h3 className="text-xl font-bold">{t("emptyTitle")}</h3>
            <p className="text-muted-foreground mt-2 max-w-sm font-medium">
              {t("emptyDesc")}
            </p>
            <Button
              variant="outline"
              className="mt-6 font-bold rounded-xl"
              onClick={() => setOpenCreate(true)}
            >
              {t("createFirst")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateBudgetForm({
  categories,
  month,
  year,
  onSuccess,
}: {
  categories: Category[];
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
        })
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

function BudgetCard({ budget }: { budget: BudgetEntry }) {
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
