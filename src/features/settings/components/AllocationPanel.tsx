"use client";

import React, { useState, useTransition } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { updateAllocationsAction } from "../actions/settings-actions";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export function AllocationPanel({ budgetSettings }: { budgetSettings: any }) {
  const t = useTranslations("Governance");
  const [isPending, startTransition] = useTransition();
    const [allocations, setAllocations] = useState({
      EXPENSES: Number(budgetSettings?.expensesPct || 50),
      INVESTMENT: Number(budgetSettings?.investmentPct || 20),
      SAVINGS: Number(budgetSettings?.savingsPct || 20),
      CHARITY: Number(budgetSettings?.charityPct || 10),
    });
    const td = useTranslations("Dashboard");
    const [error, setError] = useState("");
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const isValid = total === 100;

  const handleSave = () => {
    if (!isValid) return;
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.append("data", JSON.stringify(allocations));
      const res = await updateAllocationsAction(null, fd);
      if (!res.success) setError(res.error || t("errorUpdate"));
    });
  };

  return (
    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-[32px] shadow-sm max-w-2xl ms-0 me-auto">
      <h3 className="text-xl font-bold mb-2">{t("allocTitle")}</h3>
      <p className="text-muted-foreground text-sm font-medium mb-8">
        {t("allocDesc")}
      </p>

      {error && <div className="text-rose-500 bg-rose-500/10 p-4 rounded-xl text-sm font-bold mb-6">{error}</div>}

      <div className="space-y-8">
        {(Object.entries(allocations) as [keyof typeof allocations, number][]).map(([key, value]) => (
          <div key={key} className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
              <span className="text-foreground">{td(key.toLowerCase() as any)}</span>
              <span className="text-emerald-600 font-mono text-base">{value}%</span>
            </div>
            <Slider
              value={[value]}
              onValueChange={(val) => setAllocations(prev => ({ ...prev, [key]: val[0] }))}
              max={100}
              step={1}
              className="**:[[role=slider]]:bg-emerald-500 **:[[role=slider]]:border-emerald-500 [&_.bg-primary]:bg-emerald-500 h-2 bg-secondary/50 rounded-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-border/50 pt-8 gap-6">
         <div className="flex items-center gap-3">
           <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">{t("calibration")}</span>
           <span className={`font-mono font-black text-xl ${isValid ? "text-emerald-500" : "text-rose-500"}`}>{total}%</span>
           {!isValid && <AlertTriangle className="size-4 text-rose-500" />}
         </div>
         
         <Button 
           onClick={handleSave} 
           disabled={!isValid || isPending}
           className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8 py-6 shadow-lg shadow-emerald-500/20 active:scale-95"
         >
           {isPending ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-4 mr-2" />}
           {t("save")}
         </Button>
      </div>
    </div>
  );
}
