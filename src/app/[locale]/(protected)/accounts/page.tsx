import React from "react";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LedgerTable } from "@/features/ledger/components/LedgerTable";

export default async function AccountsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Ledger");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const ledgerEntries = await db.transactionLedger.findMany({
    where: { financialAccount: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    include: {
      financialAccount: {
        select: { type: true }
      }
    }
  });

  const serializedEntries = ledgerEntries.map(entry => ({
    ...entry,
    amount: Number(entry.amount),
    balanceAfter: Number(entry.balanceAfter),
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 w-full pt-6 px-4 md:px-0">
       <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
           {t("title")}
         </h1>
         <p className="text-muted-foreground font-medium max-w-xl">
           {t("description")}
         </p>
       </div>

       <LedgerTable entries={serializedEntries as any} />
    </div>
  );
}
