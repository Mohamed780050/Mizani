"use client";

import React, { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateAllocationsAction, updatePreferencesAction } from "../actions/settings-actions";
import { Loader2, Save, Crown, AlertTriangle } from "lucide-react";
import { dodopayments, useSession } from "@/lib/auth-client";
import { useLocale, useTranslations } from "next-intl";
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
  const isPro = subscription?.plan === "pro" && subscription?.status === "active";
  const locale = useLocale();
  return (
    <Tabs defaultValue="allocations" className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
      <TabsList className="bg-secondary/40 p-1 flex rounded-2xl w-full max-w-md mb-8 h-auto border border-border/50 overflow-x-auto no-scrollbar" >
        <TabsTrigger value="allocations" className="rounded-xl py-3 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex-1 px-2 sm:px-4">
          {t("tabAllocations")}
        </TabsTrigger>
        <TabsTrigger value="preferences" className="rounded-xl py-3 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex-1 px-2 sm:px-4">
          {t("tabPreferences")}
        </TabsTrigger>
        <TabsTrigger value="subscription" className="rounded-xl py-3 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex-1 px-2 sm:px-4 relative">
          {t("tabBilling")}
          {isPro && <Crown className="size-3 ml-1 text-amber-500 fill-amber-500 animate-pulse" />}
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
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isPro = subscription?.plan === "pro" && subscription?.status === "active";
  const isCancelled = subscription?.status === "cancelled";
  const isExpired = subscription?.status === "expired";
  const isFailed = subscription?.status === "failed";
  const isPaused = subscription?.status === "paused";
  const isOnHold = subscription?.status === "on_hold";
  const needsResubscribe = isCancelled || isExpired || isFailed;

  const statusKey = subscription?.status as string;
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: t("planActive"), color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    cancelled: { label: t("planCancelled"), color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    expired: { label: t("planExpired"), color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    on_hold: { label: t("planOnHold"), color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    paused: { label: t("planPaused"), color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    failed: { label: t("planFailed"), color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  };
  const statusInfo = statusMap[statusKey] || statusMap.active;

  const handleCheckout = () => {
    if (!session?.user) return;
    setError("");
    startTransition(async () => {
      try {
        const { data, error: checkoutError } = await dodopayments.checkout({
          slug: "pro",
          customer: {
            email: session.user.email,
            name: session.user.name,
          },
          billing: {
            city: "",
            country: "US",
            state: "",
            street: "",
            zipcode: "",
          },
        });
        if (checkoutError) {
          setError(t("checkoutError"));
          return;
        }
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch {
        setError(t("checkoutError"));
      }
    });
  };

  const handlePortal = () => {
    setError("");
    startTransition(async () => {
      try {
        const { data: portal, error: portalError } = await dodopayments.customer.portal();
        if (portalError) {
          setError(t("portalError"));
          return;
        }
        if (portal?.url) {
          window.location.href = portal.url;
        }
      } catch {
        setError(t("portalError"));
      }
    });
  };

  return (
    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-[32px] shadow-sm max-w-2xl relative overflow-hidden">
      {isPro && (
        <>
          <div className="absolute -top-10 -right-10 size-40 bg-amber-500/20 blur-3xl rounded-full" />
          <div className="absolute top-0 right-0 p-4">
            <div className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-tighter px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
               <Crown className="size-3 fill-white" />
               {t("planActive")}
            </div>
          </div>
        </>
      )}
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2">{t("subsTitle")}</h3>
        <p className="text-muted-foreground text-sm font-medium mb-8">
          {t("subsDesc")}
        </p>

        {error && (
          <div className="text-rose-500 bg-rose-500/10 p-4 rounded-xl text-sm font-bold mb-6">
            {error}
          </div>
        )}

        <div className={`p-6 rounded-2xl border ${isPro ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/[0.07] to-amber-500/[0.02] backdrop-blur-sm' : 'border-border/50 bg-secondary/20'} flex flex-col sm:flex-row items-start gap-4 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/5`}>
          <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${isPro ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40' : 'bg-primary/10 text-primary'}`}>
             <Crown className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <div className="flex flex-col">
                <h4 className="font-bold text-lg">{isPro ? t("proTitle") : t("freeTitle")}</h4>
                {isPro && <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest -mt-1">Pro Member</span>}
              </div>
              {subscription?.status && (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-1 mb-2">
              {isPro ? t("proDesc") : t("freeDesc")}
            </p>

            {/* Renewal / Cancellation date */}
            {isPro && subscription?.currentPeriodEnd && (
              <p className="text-xs font-bold text-muted-foreground/70 mb-4">
                {t("renewsOn", { date: new Date(subscription.currentPeriodEnd).toLocaleDateString() })}
              </p>
            )}
            {isCancelled && subscription?.cancelledAt && (
              <p className="text-xs font-bold text-rose-500/70 mb-4">
                {t("cancelledOn", { date: new Date(subscription.cancelledAt).toLocaleDateString() })}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              {/* Pro Active → Manage via portal */}
              {isPro && (
                <Button 
                  onClick={handlePortal}
                  disabled={isPending}
                  variant="outline" 
                  className="rounded-xl font-bold border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
                  {isPending ? t("portalLoading") : t("managePro")}
                </Button>
              )}

              {/* Free user → Upgrade */}
              {!isPro && !needsResubscribe && (
                <Button 
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="rounded-xl font-bold"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
                  {t("upgrade")}
                </Button>
              )}

              {/* Cancelled/Expired/Failed → Re-subscribe */}
              {needsResubscribe && (
                <Button 
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
                  {t("resubscribe")}
                </Button>
              )}

              {/* Paused/On Hold → Portal to manage */}
              {(isPaused || isOnHold) && (
                <Button 
                  onClick={handlePortal}
                  disabled={isPending}
                  variant="outline" 
                  className="rounded-xl font-bold"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
                  {t("managePro")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
