"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, BarChart3 } from "lucide-react";
import { NumberFormatting } from "@/components/ui/NumberFormatting";
import { BudgetCard } from "./BudgetCard";
import { CreateBudgetForm } from "./CreateBudgetForm";
import type {
  BudgetEntry,
  CategoryOption,
} from "@/features/budgets/actions/queries";

export function BudgetManager({
  budgets,
  categories,
}: {
  budgets: BudgetEntry[];
  categories: CategoryOption[];
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
