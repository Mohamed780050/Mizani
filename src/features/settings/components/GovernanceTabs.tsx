"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AllocationPanel } from "./AllocationPanel";
import { PreferencesPanel } from "./PreferencesPanel";
import { SubscriptionPanel } from "./SubscriptionPanel";

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
