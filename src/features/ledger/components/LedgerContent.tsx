import React from "react";
import db from "@/lib/db";
import { LedgerTable } from "@/features/ledger/components/LedgerTable";

export async function LedgerContent({ userId }: { userId: string }) {
  const ledgerEntries = await db.transactionLedger.findMany({
    where: { financialAccount: { userId } },
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

  return <LedgerTable entries={serializedEntries} />;
}
