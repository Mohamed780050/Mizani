import React from "react";
import db from "@/lib/db";
import { GoalGrid } from "./GoalGrid";

export async function GoalsContent({ userId }: { userId: string }) {
  const [goals, savingsAccount] = await Promise.all([
    db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    db.financialAccount.findUnique({
      where: { userId_type: { userId, type: "SAVINGS" } }
    })
  ]);

  const serializedGoals = goals.map(goal => ({
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount)
  }));

  const savingsBalance = savingsAccount ? Number(savingsAccount.balance) : 0;

  return (
    <GoalGrid goals={serializedGoals as any} savingsBalance={savingsBalance} />
  );
}
