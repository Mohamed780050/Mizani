import React from "react";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { GoalGrid } from "@/features/goals/components/GoalGrid";

export default async function GoalsPage({
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

  const [goals, savingsAccount] = await Promise.all([
    db.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.financialAccount.findUnique({
      where: { userId_type: { userId: session.user.id, type: "SAVINGS" } }
    })
  ]);

  const savingsBalance = savingsAccount ? Number(savingsAccount.balance) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 w-full pt-6 px-4 md:px-0">
       <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
           Wealth Goals
         </h1>
         <p className="text-muted-foreground font-medium max-w-xl">
           Partition your liquid savings into concrete physical milestones. Withdrawals pull natively from your master Savings account.
         </p>
       </div>

       <GoalGrid goals={goals as any} savingsBalance={savingsBalance} />
    </div>
  );
}
