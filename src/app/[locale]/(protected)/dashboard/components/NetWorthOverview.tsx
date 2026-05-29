import React from "react";
import { getTranslations } from "next-intl/server";
import { formatNumber } from "@/lib/format-utils";
import { getFinancialAccounts } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";

export async function NetWorthOverview({ userId, locale }: { userId: string, locale: string }) {
  const t = await getTranslations("Dashboard");
  
  const accounts = await getFinancialAccounts(userId);

  const totalWealth = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <section className="bg-emerald-950 dark:bg-card text-emerald-50 relative overflow-hidden rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(4,43,38,0.2)]">
      {/* Ambient Abstract glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="space-y-1">
          <h2 className="text-emerald-500 font-bold uppercase tracking-widest text-sm">{t("netWorth")}</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-7xl font-black tracking-tight font-mono">
              {formatNumber(totalWealth, { precision: 2 })}
            </span>
            <span className="text-xl md:text-2xl font-bold text-emerald-500">{t("currency")}</span>
          </div>
        </div>
        
        <p className="max-w-md text-emerald-50/70 font-medium">
          {t("summary", { count: accounts.length })}
        </p>
      </div>
    </section>
  );
}

export function NetWorthOverviewSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-[32px] p-8 md:p-12 shadow-sm space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-64 md:w-80" />
      </div>
      <Skeleton className="h-5 w-full max-w-md" />
    </div>
  );
}
