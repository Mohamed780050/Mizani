"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { 
  AccountType, 
  TransactionType, 
  ExpenseType, 
  NecessityType, 
  FrequencyType 
} from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";

const createExpenseSchema = z.object({
  amount: z.number().positive().multipleOf(0.01),
  title: z.string().min(1).max(100),
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
  categoryId: z.string(),
  
  expenseType: z.nativeEnum(ExpenseType).default(ExpenseType.VARIABLE),
  necessity: z.nativeEnum(NecessityType).default(NecessityType.ESSENTIAL),
  frequency: z.nativeEnum(FrequencyType).default(FrequencyType.ONE_TIME),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: any };

export async function addExpenseAction(
  _prevState: any,
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const userId = session.user.id;
    const rawData = formData.get("data");

    if (!rawData || typeof rawData !== "string") {
      return { success: false, error: "Invalid payload" };
    }

    const parsed = createExpenseSchema.safeParse(JSON.parse(rawData));

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { amount, title, date, notes, categoryId, expenseType, necessity, frequency } = parsed.data;

    // --- Premium Enforcement Limit ---
    const activeSub = await db.subscription.findFirst({
      where: { userId, status: "active" }
    });

    const isPro = activeSub?.plan === "pro" || activeSub?.plan === "max";

    if (!isPro) {
       const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
       const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
       
       const monthlyCount = await db.expense.count({
         where: { 
           userId, 
           date: { gte: startOfMonth, lte: endOfMonth } 
         }
       });

       if (monthlyCount >= 50) {
          return { success: false, error: "LIMIT_EXCEEDED" };
       }
    }

    await db.$transaction(async (tx) => {
      
      // 1. Fetch Expenses Account
      const expensesAccount = await tx.financialAccount.findUnique({
        where: { userId_type: { userId, type: AccountType.EXPENSES } }
      });

      if (!expensesAccount) {
        throw new Error("Sanctuary core not initialized.");
      }
      
      // 2. Decrement the balance
      const updatedAccount = await tx.financialAccount.update({
        where: { id: expensesAccount.id },
        data: { balance: { decrement: amount } },
      });

      const isRecurring = frequency === FrequencyType.MONTHLY;

      // 3. Create Expense Record
      const expense = await tx.expense.create({
        data: {
          userId,
          financialAccountId: expensesAccount.id,
          categoryId,
          amount,
          title,
          date,
          notes,
          expenseType,
          necessity,
          frequency,
          isRecurring,
        },
      });

      // 4. Create RecurringExpense ghost template if monthly
      if (isRecurring) {
         const nextRun = new Date(date);
         nextRun.setMonth(nextRun.getMonth() + 1);

         const recurring = await tx.recurringExpense.create({
           data: {
             userId,
             title,
             amount,
             categoryId,
             financialAccountId: expensesAccount.id,
             interval: FrequencyType.MONTHLY,
             startDate: date,
             nextRunDate: nextRun,
             isActive: true,
           }
         });

         // Link the expense back to its recurring parent
         await tx.expense.update({
           where: { id: expense.id },
           data: { recurringExpenseId: recurring.id }
         });
      }

      // 5. Write the immutable ledger entry
      await tx.transactionLedger.create({
        data: {
          financialAccountId: expensesAccount.id,
          amount,
          type: TransactionType.DEBIT,
          refType: "expense",
          refId: expense.id,
          note: `Expense: ${title}`,
          balanceAfter: updatedAccount.balance,
          currency: expensesAccount.currency,
        },
      });
      
      // 6. Category Budget Alert System
      const categoryMonth = date.getMonth() + 1;
      const categoryYear = date.getFullYear();

      const categoryBudget = await tx.budget.findUnique({
        where: { 
          userId_categoryId_month_year: { 
            userId, 
            categoryId, 
            month: categoryMonth, 
            year: categoryYear 
          } 
        }
      });

      if (categoryBudget) {
         const currentMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);
         const currentMonthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
         
         const allCategoryExpenses = await tx.expense.aggregate({
            _sum: { amount: true },
            where: {
              userId,
              categoryId,
              date: { gte: currentMonthStart, lte: currentMonthEnd }
            }
         });

         const totalSpent = Number(allCategoryExpenses._sum.amount || 0);
         const budgetLimit = Number(categoryBudget.limit);
         const threshold = budgetLimit * 0.8;

         if (totalSpent >= threshold && (totalSpent - amount) < threshold) {
            await tx.notification.create({
              data: {
                userId,
                type: "BUDGET_ALERT",
                title: "Budget Warning",
                body: `You've consumed over 80% of your monthly budget.`,
              }
            });
         }
      }

    });

    revalidatePath("/(protected)/dashboard", "page");
    revalidatePath("/(protected)/accounts", "page");

    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    console.error("Expense addition failed:", error);
    return { success: false, error: error.message || "Failed to process expense." };
  }
}
