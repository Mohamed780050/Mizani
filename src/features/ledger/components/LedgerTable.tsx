"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

// Define the precise nested query output securely
type LedgerEntry = {
  id: string;
  amount: Prisma.Decimal;
  type: "CREDIT" | "DEBIT";
  refType: string;
  note: string | null;
  createdAt: Date;
  balanceAfter: Prisma.Decimal;
  financialAccount: {
    type: string;
  };
};

export function LedgerTable({ entries }: { entries: LedgerEntry[] }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-border/50 text-center">
        <div className="size-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <Wallet className="size-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Your immutable ledger will begin tracking the moment you initialize an account balance or log a revenue stream.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-secondary/20">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] py-5 pl-6">Type</TableHead>
            <TableHead className="py-5">Description</TableHead>
            <TableHead className="py-5">Account</TableHead>
            <TableHead className="py-5">Amount</TableHead>
            <TableHead className="py-5 text-right pr-6">Rolling Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} className="transition-colors hover:bg-secondary/10">
              <TableCell className="font-medium pl-6 py-4">
                {entry.type === "CREDIT" ? (
                  <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <ArrowDownRight className="size-5" />
                  </div>
                ) : (
                  <div className="size-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <ArrowUpRight className="size-5" />
                  </div>
                )}
              </TableCell>
              <TableCell className="py-4">
                <div className="font-bold text-[15px]">
                  {entry.note || "General Transaction"}
                </div>
                <div className="text-xs font-semibold text-muted-foreground monochrome font-mono mt-1 opacity-70">
                  {new Date(entry.createdAt).toLocaleString()} • REF: {entry.refType.toUpperCase()}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="bg-background text-xs font-bold uppercase tracking-wider">
                  {entry.financialAccount.type}
                </Badge>
              </TableCell>
              <TableCell className="py-4 font-mono font-bold text-[15px]">
                <span className={entry.type === "CREDIT" ? "text-emerald-500" : "text-rose-500"}>
                  {entry.type === "CREDIT" ? "+" : "-"}
                  {Number(entry.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </TableCell>
              <TableCell className="text-right pr-6 py-4 font-mono font-black text-primary text-base">
                {Number(entry.balanceAfter).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
