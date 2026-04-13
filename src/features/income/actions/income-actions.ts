"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { AccountType, TransactionType } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";

const createIncomeSchema = z.object({
  amount: z.number().positive().multipleOf(0.01),
  source: z.string().min(1).max(100),
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
  allocations: z.object({
    EXPENSES: z.number().min(0).max(100),
    INVESTMENT: z.number().min(0).max(100),
    SAVINGS: z.number().min(0).max(100),
    CHARITY: z.number().min(0).max(100),
  }).refine((p) => Object.values(p).reduce((a, b) => a + b, 0) === 100, {
    message: "Allocation percentages must sum to 100",
  }),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: any };

export async function addIncomeAction(
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

    const parsed = createIncomeSchema.safeParse(JSON.parse(rawData));

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { amount, source, date, notes, allocations } = parsed.data;

    // We do atomic multi-step DB persistence
    await db.$transaction(async (tx) => {
      // 1. Create Income Record
      const income = await tx.income.create({
        data: {
          userId,
          amount,
          source,
          date,
          notes,
        },
      });

      // 2. Fetch all 4 target accounts (Fail if not initialized)
      const accounts = await tx.financialAccount.findMany({
        where: { userId },
      });

      if (accounts.length < 4) {
        throw new Error("Financial framework is not fully initialized.");
      }

      const accountTypes = [
        AccountType.EXPENSES,
        AccountType.INVESTMENT,
        AccountType.SAVINGS,
        AccountType.CHARITY,
      ];

      for (const type of accountTypes) {
        const percentage = allocations[type];
        if (percentage === 0) continue;

        const allocatedAmount = Number(amount) * (percentage / 100);
        const account = accounts.find((a) => a.type === type);

        if (!account) throw new Error(`Missing ${type} account.`);

        // a) Record the Allocation Split
        await tx.allocation.create({
          data: {
            incomeId: income.id,
            financialAccountId: account.id,
            amount: allocatedAmount,
            percentage: percentage,
          },
        });

        // b) Increment the balance mathematically
        const updatedAccount = await tx.financialAccount.update({
          where: { id: account.id },
          data: { balance: { increment: allocatedAmount } },
        });

        // c) Write the immutable ledger entry
        await tx.transactionLedger.create({
          data: {
            financialAccountId: account.id,
            amount: allocatedAmount,
            type: TransactionType.CREDIT,
            refType: "income",
            refId: income.id,
            note: `Income: ${source} (${percentage}%)`,
            balanceAfter: updatedAccount.balance,
            currency: account.currency,
          },
        });
      }
    });

    // Revalidate paths correctly instead of responding with error on navigation
    revalidatePath("/(protected)/dashboard", "page");
    revalidatePath("/(protected)/accounts", "page");

    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    console.error("Income addition failed:", error);
    return { success: false, error: error.message || "Failed to process income." };
  }
}
