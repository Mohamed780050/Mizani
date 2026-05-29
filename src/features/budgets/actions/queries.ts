import db from "@/lib/db";

export type BudgetEntry = {
  id: string;
  categoryId: string;
  limit: number;
  month: number;
  year: number;
  category: {
    name: string;
    emoji: string;
  };
  spent: number;
};

export type CategoryOption = {
  id: string;
  name: string;
  emoji: string;
};

/**
 * Fetches all budgets for the current month with their spent amounts.
 */
export async function getBudgetsWithSpent(userId: string): Promise<BudgetEntry[]> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthStart = new Date(currentYear, currentMonth - 1, 1);
  const monthEnd = new Date(currentYear, currentMonth, 0);

  const [budgetsRaw, spentByCategory] = await Promise.all([
    db.budget.findMany({
      where: {
        userId,
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
    db.expense.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        date: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),
  ]);

  const spentMap = new Map(
    spentByCategory.map((s) => [s.categoryId, Number(s._sum.amount || 0)])
  );

  return budgetsRaw.map((b) => ({
    id: b.id,
    categoryId: b.categoryId,
    limit: Number(b.limit),
    month: b.month,
    year: b.year,
    category: b.category,
    spent: spentMap.get(b.categoryId) || 0,
  }));
}

/**
 * Fetches all active (non-archived) categories for the user.
 */
export async function getUserCategories(userId: string): Promise<CategoryOption[]> {
  return db.category.findMany({
    where: { userId, isArchived: false },
    select: { id: true, name: true, emoji: true },
    orderBy: { name: "asc" },
  });
}
