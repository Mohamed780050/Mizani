import React from "react";
import db from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export async function RecentActivityLedger({ userId, locale }: { userId: string, locale: string }) {
  const t = await getTranslations("Dashboard");

  const recentTransactions = await db.transactionLedger.findMany({
    where: { financialAccount: { userId } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { financialAccount: true }
  });

  return (
    <section className="bg-card border border-border/50 rounded-[32px] p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-emerald-950 dark:text-emerald-50">{t("recentActivity")}</h3>
      
      {recentTransactions.length === 0 ? (
         <div className="text-center py-12 text-muted-foreground font-medium">
            {t("emptyActivity")}
         </div>
      ) : (
        <div className="space-y-1">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-secondary/20 hover:bg-secondary/50 transition-colors rounded-2xl group">
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl ${tx.type === "CREDIT" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                    {tx.type === "CREDIT" ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                 </div>
                 <div>
                    <p className="font-semibold text-foreground truncate">{tx.note || tx.refType}</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-0.5">{t(tx.financialAccount.type.toLowerCase() as any)}</p>
                 </div>
              </div>
              <div className="text-end">
                 <p className={`font-black font-mono text-lg ${tx.type === "CREDIT" ? "text-emerald-600" : "text-foreground"}`}>
                    {tx.type === "CREDIT" ? "+" : "-"}{Number(tx.amount).toLocaleString()}
                 </p>
                 <p className="text-xs text-muted-foreground font-medium">
                    {new Date(tx.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                 </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
