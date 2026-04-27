"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { createGoalAction } from "../actions/goal-actions";

export function CreateGoalForm({ onSuccess }: { onSuccess: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const t = useTranslations("Goals");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          title,
          targetAmount: Number(amount),
          deadline: date ? new Date(date).toISOString() : undefined,
        }),
      );
      const res = await createGoalAction(null, fd);
      if (res.success) onSuccess();
      else setError(res.error || t("errorDefault"));
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
      <SheetHeader className="text-left space-y-2 pt-6">
        <SheetTitle className="text-2xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
          {t("newTitle")}
        </SheetTitle>
        <SheetDescription className="text-muted-foreground">
          {t("newDesc")}
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-6 mt-8 pb-10">
        {error && (
          <div className="text-rose-500 text-sm font-bold bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
            {t("goalIdentity")}
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("goalPlaceholder")}
            className="bg-card border-none py-6 rounded-xl font-bold shadow-sm focus-visible:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
            {t("targetCapital")}
          </label>
          <Input
            required
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="0.00"
            className="bg-card border-none py-6 rounded-xl font-mono font-black text-emerald-600 dark:text-emerald-400 text-xl shadow-sm focus-visible:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
            {t("deadline")}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-card border-none py-6 pl-9 rounded-xl font-bold shadow-sm focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <Button
          disabled={isPending}
          type="submit"
          className="w-full py-7 font-bold text-lg rounded-xl mt-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          {isPending ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            t("establishBtn")
          )}
        </Button>
      </form>
    </div>
  );
}
