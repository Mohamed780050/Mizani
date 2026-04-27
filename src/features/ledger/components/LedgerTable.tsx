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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Ledger");
  const td = useTranslations("Dashboard");
  
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-border/50 text-center">
        <div className="size-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <Wallet className="size-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t("emptyTitle")}</h3>
        <p className="text-muted-foreground max-w-sm">
          {t("emptyDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
      <div className="overflow-x-auto no-scrollbar">
        <Table className="min-w-[600px] lg:min-w-0">
          <TableHeader className="bg-secondary/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] py-5 pl-6">{t("colType")}</TableHead>
              <TableHead className="py-5">{t("colDesc")}</TableHead>
              <TableHead className="py-5 hidden sm:table-cell">{t("colAccount")}</TableHead>
              <TableHead className="py-5">{t("colAmount")}</TableHead>
              <TableHead className="py-5 text-right pr-6 hidden md:table-cell">{t("colRolling")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className="transition-colors hover:bg-secondary/10">
                <TableCell className="font-medium pl-6 py-4">
                  {entry.type === "CREDIT" ? (
                    <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <ArrowDownRight className="size-4" />
                    </div>
                  ) : (
                    <div className="size-9 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <ArrowUpRight className="size-4" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="font-bold text-[14px] sm:text-[15px] truncate max-w-[120px] sm:max-w-[200px]">
                    {entry.note || t("generalTx")}
                  </div>
                  <div className="text-[10px] font-semibold text-muted-foreground monochrome font-mono mt-0.5 opacity-70">
                    {new Date(entry.createdAt).toLocaleDateString()} • {entry.refType.toUpperCase()}
                  </div>
                </TableCell>
                <TableCell className="py-4 hidden sm:table-cell">
                  <Badge variant="outline" className="bg-background text-[10px] font-bold uppercase tracking-wider">
                    {td(entry.financialAccount.type.toLowerCase() as any)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 font-mono font-bold text-[14px] sm:text-[15px]">
                  <span className={entry.type === "CREDIT" ? "text-emerald-500" : "text-rose-500"}>
                    {entry.type === "CREDIT" ? "+" : "-"}
                    {Number(entry.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6 py-4 font-mono font-black text-primary text-sm sm:text-base hidden md:table-cell">
                  {Number(entry.balanceAfter).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
