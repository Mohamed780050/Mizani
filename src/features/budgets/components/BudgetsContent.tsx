import React from "react";
import {
  getBudgetsWithSpent,
  getUserCategories,
} from "@/features/budgets/actions/queries";
import { BudgetManager } from "./BudgetManager";

export async function BudgetsContent({ userId }: { userId: string }) {
  const [budgets, categories] = await Promise.all([
    getBudgetsWithSpent(userId),
    getUserCategories(userId),
  ]);

  return <BudgetManager budgets={budgets} categories={categories} />;
}
