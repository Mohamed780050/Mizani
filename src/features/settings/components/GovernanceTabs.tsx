"use client";

import React, { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateAllocationsAction, updatePreferencesAction } from "../actions/settings-actions";
import { Loader2, Save, Crown, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";

export function GovernanceTabs({
  budgetSettings,
  preferences,
  subscription,
}: {
  budgetSettings: any;
  preferences: any;
  subscription: any;
}) {
  const t = useTranslations("Governance");
  return (
    <Tabs defaultValue="allocations" className="w-full">
      <TabsList className="bg-secondary/40 p-1 flex rounded-2xl w-full max-w-md mb-8 h-auto border border-border/50 overflow-x-auto no-scrollbar">
        <TabsTrigger value="allocations" className="rounded-xl py-3 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex-1 px-2 sm:px-4">
          {t("tabAllocations")}
        </TabsTrigger>
        <TabsTrigger value="preferences" className="rounded-xl py-3 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex-1 px-2 sm:px-4">
          {t("tabPreferences")}
        </TabsTrigger>
        <TabsTrigger value="subscription" className="rounded-xl py-3 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex-1 px-2 sm:px-4">
          {t("tabBilling")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="allocations" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
        <AllocationPanel budgetSettings={budgetSettings} />
      </TabsContent>

      <TabsContent value="preferences" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
        <PreferencesPanel preferences={preferences} />
      </TabsContent>

      <TabsContent value="subscription" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
        <SubscriptionPanel subscription={subscription} />
      </TabsContent>
    </Tabs>
  );
}

function AllocationPanel({ budgetSettings }: { budgetSettings: any }) {
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
    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-[32px] shadow-sm max-w-2xl">
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

function PreferencesPanel({ preferences }: { preferences: any }) {
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
    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-[32px] shadow-sm max-w-2xl space-y-8">
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

function SubscriptionPanel({ subscription }: { subscription: any }) {
  const t = useTranslations("Governance");
  const isPro = subscription?.plan === "pro";

  return (
    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-[32px] shadow-sm max-w-2xl relative overflow-hidden">
      {isPro && <div className="absolute -top-10 -right-10 size-40 bg-amber-500/10 blur-3xl rounded-full" />}
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2">{t("subsTitle")}</h3>
        <p className="text-muted-foreground text-sm font-medium mb-8">
          {t("subsDesc")}
        </p>

        <div className={`p-6 rounded-2xl border ${isPro ? 'border-amber-500/30 bg-amber-500/5' : 'border-border/50 bg-secondary/20'} flex items-start gap-4`}>
          <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${isPro ? 'bg-amber-500 text-white' : 'bg-primary/10 text-primary'}`}>
             <Crown className="size-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">{isPro ? t("proTitle") : t("freeTitle")}</h4>
            <p className="text-sm font-medium text-muted-foreground mt-1 mb-4">
              {isPro ? t("proDesc") : t("freeDesc")}
            </p>
            
            <Button disabled variant={isPro ? "outline" : "default"} className={`rounded-xl font-bold ${isPro ? 'border-amber-500/50 text-amber-600 hover:bg-amber-500/10' : ''}`}>
               {isPro ? t("managePro") : t("upgrade")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
