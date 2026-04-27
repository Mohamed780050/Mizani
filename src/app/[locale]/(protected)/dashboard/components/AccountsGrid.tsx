import React from "react";
import db from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Wallet, TrendingUp, PiggyBank, HeartHandshake } from "lucide-react";
import { AccountCard } from "./AccountCard";

export async function AccountsGrid({ userId, locale }: { userId: string, locale: string }) {
  const t = await getTranslations("Dashboard");
  
  const accounts = await db.financialAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" }
  });

  const getAccountData = (type: string) => {
    return accounts.find(a => a.type === type) || { balance: 0 };
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AccountCard 
        title={t("expenses")} 
        amount={Number(getAccountData("EXPENSES").balance)} 
        icon={Wallet} 
        color="text-slate-600 bg-slate-100 dark:bg-slate-900 dark:text-slate-400"
        locale={locale}
      />
      <AccountCard 
        title={t("investment")} 
        amount={Number(getAccountData("INVESTMENT").balance)} 
        icon={TrendingUp} 
        color="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
        locale={locale}
      />
      <AccountCard 
        title={t("savings")} 
        amount={Number(getAccountData("SAVINGS").balance)} 
        icon={PiggyBank} 
        color="text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
        locale={locale}
      />
      <AccountCard 
        title={t("charity")} 
        amount={Number(getAccountData("CHARITY").balance)} 
        icon={HeartHandshake} 
        color="text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400"
        locale={locale}
      />
    </section>
  );
}
