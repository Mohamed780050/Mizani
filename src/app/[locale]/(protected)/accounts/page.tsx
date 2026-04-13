import React from "react";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { LedgerTable } from "@/features/ledger/components/LedgerTable";

export default async function AccountsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 w-full pt-6">
       <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
           Immutable Ledger
         </h1>
         <p className="text-muted-foreground font-medium max-w-xl">
           The chronological source of truth. Every transaction, sub-division, and goal contribution is recorded here securely.
         </p>
       </div>

       <LedgerTable entries={ledgerEntries as any} />
    </div>
  );
}
