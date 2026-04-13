"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { AccountType, TransactionType, Currency } from "@/generated/prisma/enums";

const onboardingSchema = z.object({
  percentages: z.object({
    EXPENSES: z.number().min(0).max(100),
    INVESTMENT: z.number().min(0).max(100),
    SAVINGS: z.number().min(0).max(100),
    CHARITY: z.number().min(0).max(100),
  }).refine((p) => Object.values(p).reduce((a, b) => a + b, 0) === 100, {
    message: "Allocation percentages must sum to 100",
  }),
  initialBalances: z.object({
    EXPENSES: z.number().min(0),
    INVESTMENT: z.number().min(0),
    SAVINGS: z.number().min(0),
    CHARITY: z.number().min(0),
  }),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: any };

export async function submitOnboardingAction(
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

    // Parse formData manually since it's nested JSON
    const rawData = formData.get("data");
    if (!rawData || typeof rawData !== "string") {
      return { success: false, error: "Invalid form payload" };
    }

    const parsedData = onboardingSchema.safeParse(JSON.parse(rawData));

    if (!parsedData.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsedData.error.flatten().fieldErrors,
      };
    }

    const { percentages, initialBalances } = parsedData.data;

    await db.$transaction(async (tx) => {
      // 1. Create Budget Settings
      await tx.budgetSetting.upsert({
        where: { userId },
        update: {
          expensesPct: percentages.EXPENSES,
          investmentPct: percentages.INVESTMENT,
          savingsPct: percentages.SAVINGS,
          charityPct: percentages.CHARITY,
        },
        create: {
          userId,
          expensesPct: percentages.EXPENSES,
          investmentPct: percentages.INVESTMENT,
          savingsPct: percentages.SAVINGS,
          charityPct: percentages.CHARITY,
        },
      });

      // 2. Initialize 4 Core Accounts & Ledgers
      const accountTypes = [
        AccountType.EXPENSES,
        AccountType.INVESTMENT,
        AccountType.SAVINGS,
        AccountType.CHARITY,
      ];

      for (const type of accountTypes) {
        const initialBal = initialBalances[type] || 0;

        const finAccount = await tx.financialAccount.upsert({
          where: { userId_type: { userId, type } },
          update: {
            balance: initialBal,
            initialBalance: initialBal,
            targetPct: percentages[type],
          },
          create: {
            userId,
            type,
            balance: initialBal,
            initialBalance: initialBal,
            targetPct: percentages[type],
            currency: Currency.EGP,
          },
        });

        // Write ledger only if greater than 0
        if (initialBal > 0) {
          await tx.transactionLedger.create({
            data: {
              financialAccountId: finAccount.id,
              amount: initialBal,
              type: TransactionType.CREDIT,
              refType: "initial_balance",
              balanceAfter: initialBal,
              currency: finAccount.currency,
            },
          });
        }
      }

      // 3. Seed Default Categories
      const defaults = [
        { name: "Housing", emoji: "🏠" },
        { name: "Food & Dining", emoji: "🍔" },
        { name: "Transportation", emoji: "🚗" },
        { name: "Utilities", emoji: "⚡" },
        { name: "Shopping", emoji: "🛍️" },
        { name: "Healthcare", emoji: "⚕️" },
        { name: "Personal Care", emoji: "💇" },
        { name: "Entertainment", emoji: "🎭" },
      ];

      for (const cat of defaults) {
        await tx.category.upsert({
          where: { userId_name: { userId, name: cat.name } },
          update: {}, // Do nothing if exists
          create: {
            userId,
            name: cat.name,
            emoji: cat.emoji,
            isDefault: true,
          },
        });
      }

      // 4. Set onboarding complete on User
      // Note: we're using Prisma directly because we extended the schema
      await tx.user.update({
        where: { id: userId },
        data: { onboardingComplete: true },
      });
    }, {
      timeout: 10000 // Give it generous time since so many ops are running
    });

    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    console.error("Onboarding setup failed:", error);
    return { success: false, error: error.message || "Failed to initialize account." };
  }
}
