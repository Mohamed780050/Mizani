"use client";

import React, { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { updatePreferencesAction } from "../actions/settings-actions";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";

export function PreferencesPanel({ preferences }: { preferences: any }) {
  const t = useTranslations("Governance");
  const [isPending, startTransition] = useTransition();
  const [prefs, setPrefs] = useState({
    notifRecurring: preferences?.notifRecurring ?? true,
    notifBudgetAlert: preferences?.notifBudgetAlert ?? true,
    notifGoal: preferences?.notifGoal ?? true,
    theme: preferences?.theme ?? "light",
  });

  const handleChange = (key: string, checked: boolean) => {
    const next = { ...prefs, [key]: checked };
    setPrefs(next);
    
    startTransition(async () => {
      const fd = new FormData();
      fd.append("data", JSON.stringify(next));
      await updatePreferencesAction(null, fd);
    });
  };

  return (
    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-[32px] shadow-sm max-w-2xl space-y-8 ms-0 me-auto">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold mb-2">{t("prefTitle")}</h3>
          <p className="text-muted-foreground text-sm font-medium mb-8">
            {t("prefDesc")}
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle variant="outline" className="rounded-xl border-border/50 shadow-sm" />
          <LangToggle variant="outline" className="rounded-xl border-border/50 shadow-sm" />
        </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-2xl border border-border/50">
           <div>
             <h4 className="font-bold text-sm">{t("recurring")}</h4>
             <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{t("recurringDesc")}</p>
           </div>
           <Switch checked={prefs.notifRecurring} onCheckedChange={(c) => handleChange('notifRecurring', c)} disabled={isPending} />
         </div>

         <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-2xl border border-border/50">
           <div>
             <h4 className="font-bold text-sm">{t("budgetWarn")}</h4>
             <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{t("budgetWarnDesc")}</p>
           </div>
           <Switch checked={prefs.notifBudgetAlert} onCheckedChange={(c) => handleChange('notifBudgetAlert', c)} disabled={isPending} />
         </div>

         <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-2xl border border-border/50">
           <div>
             <h4 className="font-bold text-sm">{t("goalMilestones")}</h4>
             <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{t("goalMilestonesDesc")}</p>
           </div>
           <Switch checked={prefs.notifGoal} onCheckedChange={(c) => handleChange('notifGoal', c)} disabled={isPending} />
         </div>
      </div>
    </div>
  );
}
