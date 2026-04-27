import db from "@/lib/db";
import {
  AccountType,
  TransactionType,
  FrequencyType,
  ExpenseType,
  NecessityType,
} from "@/generated/prisma/enums";
import { PlanLimitError } from "@/lib/errors";

export type CreateExpenseInput = {
  amount: number;
  title: string;
  date: Date;
  notes?: string;
  categoryId: string;
  expenseType: ExpenseType;
  necessity: NecessityType;
  frequency: FrequencyType;
};

export const expenseModel = {
  /**
   * Checks plan limits before creating an expense.
   * Throws PlanLimitError if limits are exceeded.
   */
  async checkPlanLimits(userId: string, date: Date, frequency: FrequencyType) {
    const activeSub = await db.subscription.findFirst({
      where: { userId, status: "active" },
    });
    const isPro = activeSub?.plan === "pro" || activeSub?.plan === "max";

    if (!isPro) {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthlyCount = await db.expense.count({
        where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      });

      if (monthlyCount >= 50) {
        throw new PlanLimitError("LIMIT_EXCEEDED");
      }

      if (frequency === FrequencyType.MONTHLY) {
        throw new PlanLimitError("RECURRING_NOT_AVAILABLE");
      }
    }
  },

  async create(userId: string, data: CreateExpenseInput) {
    return db.$transaction(async (tx) => {
      // 1. Fetch Expenses Account
      const expensesAccount = await tx.financialAccount.findUnique({
        where: { userId_type: { userId, type: AccountType.EXPENSES } },
      });

      if (!expensesAccount) {
        throw new Error("Sanctuary core not initialized.");
      }

      // 2. Decrement the balance
      const updatedAccount = await tx.financialAccount.update({
        where: { id: expensesAccount.id },
        data: { balance: { decrement: data.amount } },
      });

      const isRecurring = data.frequency === FrequencyType.MONTHLY;

      // 3. Create Expense Record
      const expense = await tx.expense.create({
        data: {
          userId,
          financialAccountId: expensesAccount.id,
          categoryId: data.categoryId,
          amount: data.amount,
          title: data.title,
          date: data.date,
          notes: data.notes,
          expenseType: data.expenseType,
          necessity: data.necessity,
          frequency: data.frequency,
          isRecurring,
        },
      });

      // 4. Create RecurringExpense template if monthly
      if (isRecurring) {
        const nextRun = new Date(data.date);
        nextRun.setMonth(nextRun.getMonth() + 1);

        const recurring = await tx.recurringExpense.create({
          data: {
            userId,
            title: data.title,
            amount: data.amount,
            categoryId: data.categoryId,
            financialAccountId: expensesAccount.id,
            interval: FrequencyType.MONTHLY,
            startDate: data.date,
            nextRunDate: nextRun,
            isActive: true,
          },
        });

        await tx.expense.update({
          where: { id: expense.id },
          data: { recurringExpenseId: recurring.id },
        });
      }

      // 5. Write the immutable ledger entry with idempotency key
      await tx.transactionLedger.create({
        data: {
          financialAccountId: expensesAccount.id,
          amount: data.amount,
          type: TransactionType.DEBIT,
          refType: "expense",
          refId: expense.id,
          note: `Expense: ${data.title}`,
          balanceAfter: updatedAccount.balance,
          currency: expensesAccount.currency,
          idempotencyKey: `expense_${expense.id}`,
        },
      });

      // 6. Category Budget Alert System
      const categoryMonth = data.date.getMonth() + 1;
      const categoryYear = data.date.getFullYear();

      const categoryBudget = await tx.budget.findUnique({
        where: {
          userId_categoryId_month_year: {
            userId,
            categoryId: data.categoryId,
            month: categoryMonth,
            year: categoryYear,
          },
        },
      });

      if (categoryBudget) {
        const currentMonthStart = new Date(data.date.getFullYear(), data.date.getMonth(), 1);
        const currentMonthEnd = new Date(data.date.getFullYear(), data.date.getMonth() + 1, 0);

        const allCategoryExpenses = await tx.expense.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            categoryId: data.categoryId,
            date: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        });

        const totalSpent = Number(allCategoryExpenses._sum.amount || 0);
        const budgetLimit = Number(categoryBudget.limit);
        const threshold80 = budgetLimit * 0.8;
        const prevSpent = totalSpent - data.amount;

        // 80% threshold alert
        if (totalSpent >= threshold80 && prevSpent < threshold80) {
          await tx.notification.create({
            data: {
              userId,
              type: "BUDGET_ALERT",
              title: "Budget Warning",
              body: `You've consumed over 80% of your monthly budget.`,
            },
          });
        }

        // 100% exceeded alert
        if (totalSpent >= budgetLimit && prevSpent < budgetLimit) {
          await tx.notification.create({
            data: {
              userId,
              type: "LIMIT_WARNING",
              title: "Budget Exceeded",
              body: `You've exceeded 100% of your monthly budget.`,
            },
          });
        }
      }

      return expense;
    });
  },
};
