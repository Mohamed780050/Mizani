import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { TransactionType, FrequencyType } from "@/generated/prisma/enums";

/**
 * Recurring Expense CRON Handler
 * 
 * Intended to be hit by Coolify/Vercel CRON at 00:05 UTC on the 1st of each month.
 * Processes all active RecurringExpenses whose nextRunDate <= now().
 * 
 * Each recurring expense is cloned into the Expense table, the account balance
 * is decremented, and an immutable TransactionLedger entry is written — all 
 * wrapped atomically per-expense inside a db.$transaction().
 */
export async function GET(request: NextRequest) {
  // Simple CRON secret guard
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let processed = 0;
  let failed = 0;

  try {
    // Fetch all due recurring expenses
    const dueRecurring = await db.recurringExpense.findMany({
      where: {
        isActive: true,
        nextRunDate: { lte: now },
      },
      include: {
        financialAccount: true,
        category: true,
      },
    });

    for (const recurring of dueRecurring) {
      try {
        await db.$transaction(async (tx) => {
          // 1. Decrement the financial account balance
          const updatedAccount = await tx.financialAccount.update({
            where: { id: recurring.financialAccountId },
            data: { balance: { decrement: recurring.amount } },
          });

          // 2. Create the cloned Expense for this period
          const expense = await tx.expense.create({
            data: {
              userId: recurring.userId,
              financialAccountId: recurring.financialAccountId,
              categoryId: recurring.categoryId,
              amount: recurring.amount,
              title: recurring.title,
              date: now,
              expenseType: "FIXED",
              necessity: "ESSENTIAL",
              frequency: recurring.interval,
              isRecurring: true,
              recurringExpenseId: recurring.id,
              notes: `Auto-generated from recurring: ${recurring.title}`,
            },
          });

          // 3. Write immutable ledger entry
          await tx.transactionLedger.create({
            data: {
              financialAccountId: recurring.financialAccountId,
              amount: recurring.amount,
              type: TransactionType.DEBIT,
              refType: "recurring_expense",
              refId: expense.id,
              note: `Recurring: ${recurring.title}`,
              balanceAfter: updatedAccount.balance,
              currency: updatedAccount.currency,
            },
          });

          // 4. Advance nextRunDate
          const nextRun = new Date(recurring.nextRunDate);
          if (recurring.interval === FrequencyType.MONTHLY) {
            nextRun.setMonth(nextRun.getMonth() + 1);
          }

          await tx.recurringExpense.update({
            where: { id: recurring.id },
            data: {
              lastRunDate: now,
              nextRunDate: nextRun,
            },
          });

          // 5. Notify user
          await tx.notification.create({
            data: {
              userId: recurring.userId,
              type: "RECURRING_DEDUCTED",
              title: "Recurring Expense Processed",
              body: `"${recurring.title}" (${Number(recurring.amount).toLocaleString()} EGP) was automatically deducted.`,
            },
          });
        });

        processed++;
      } catch (err) {
        console.error(`Failed to process recurring expense ${recurring.id}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      status: "completed",
      processed,
      failed,
      total: dueRecurring.length,
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error("CRON recurring handler failed:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
