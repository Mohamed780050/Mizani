import React from "react";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BudgetManager } from "@/features/budgets/components/BudgetManager";

export default async function BudgetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Budget");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthStart = new Date(currentYear, currentMonth - 1, 1);
  const monthEnd = new Date(currentYear, currentMonth, 0);

  const [budgetsRaw, categories] = await Promise.all([
    db.budget.findMany({
      where: {
        userId: session.user.id,
        month: currentMonth,
        year: currentYear,
      },
      include: {
        category: {
          select: { name: true, emoji: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      where: { userId: session.user.id, isArchived: false },
      select: { id: true, name: true, emoji: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Calculate spent per category for the current month
  const spentByCategory = await db.expense.groupBy({
    by: ["categoryId"],
    where: {
      userId: session.user.id,
      date: { gte: monthStart, lte: monthEnd },
    },
    _sum: { amount: true },
  });

  const spentMap = new Map(
    spentByCategory.map((s) => [s.categoryId, Number(s._sum.amount || 0)])
  );

  const budgets = budgetsRaw.map((b) => ({
    id: b.id,
    categoryId: b.categoryId,
    limit: Number(b.limit),
    month: b.month,
    year: b.year,
    category: b.category,
    spent: spentMap.get(b.categoryId) || 0,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 w-full pt-6 px-4 md:px-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
          {t("pageTitle")}
        </h1>
        <p className="text-muted-foreground font-medium max-w-xl">
          {t("pageDesc")}
        </p>
      </div>

      <BudgetManager budgets={budgets} categories={categories} />
    </div>
  );
}
