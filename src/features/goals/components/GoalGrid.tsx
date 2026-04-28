"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GoalCard } from "./GoalCard";
import { CreateGoalForm } from "./CreateGoalForm";
import { NumberFormatting } from "@/components/ui/NumberFormatting";

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  isCompleted: boolean;
};

export function GoalGrid({
  goals,
  savingsBalance,
}: {
  goals: Goal[];
  savingsBalance: number;
}) {
  const t = useTranslations("Goals");
  const td = useTranslations("Dashboard");
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header specific to Goals */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm gap-6 sm:gap-0">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            {t("power")}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-500">
              <NumberFormatting value={savingsBalance} />
            </span>
            <span className="text-sm font-bold text-muted-foreground uppercase">{td("currency")}</span>
          </div>
        </div>

        <Sheet open={openCreate} onOpenChange={setOpenCreate}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full px-6 py-6 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Plus className="size-5" />
              <span>{t("createBtn")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md bg-[#f7f9ff] dark:bg-[#080b0e] border-s-border/50 p-4 sm:p-6">
            <CreateGoalForm onSuccess={() => setOpenCreate(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} currentSavings={savingsBalance} />
        ))}

        {goals.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[3rem] text-center bg-secondary/10">
            <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <Target className="size-10 text-emerald-500 opacity-80" />
            </div>
            <h3 className="text-2xl font-black text-emerald-950 dark:text-emerald-50">{t("emptyTitle")}</h3>
            <p className="text-muted-foreground mt-3 max-w-sm font-medium px-4">
              {t("emptyDesc")}
            </p>
            <Button
              variant="outline"
              className="mt-8 font-bold rounded-xl border-emerald-500/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
              onClick={() => setOpenCreate(true)}
            >
              {t("draftFirst")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
