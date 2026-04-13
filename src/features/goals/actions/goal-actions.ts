"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createGoalSchema = z.object({
  title: z.string().min(1).max(100),
  targetAmount: z.number().positive(),
  deadline: z.coerce.date().optional(),
});

const fundGoalSchema = z.object({
  goalId: z.string().cuid(),
  amount: z.number().positive(),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: any };

export async function createGoalAction(
  _prevState: any,
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return { success: false, error: "UNAUTHORIZED" };
    const userId = session.user.id;

    const rawData = formData.get("data");
    if (!rawData || typeof rawData !== "string") return { success: false, error: "Invalid payload" };

    const parsed = createGoalSchema.safeParse(JSON.parse(rawData));
    if (!parsed.success) {
      return { success: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const { title, targetAmount, deadline } = parsed.data;

    const savingsAccount = await db.financialAccount.findUnique({
      where: { userId_type: { userId, type: "SAVINGS" } }
    });

    if (!savingsAccount) return { success: false, error: "Savings account not initialized." };

    const newGoal = await db.goal.create({
      data: {
        userId,
        financialAccountId: savingsAccount.id,
        title,
        targetAmount,
        deadline,
      }
    });

    revalidatePath("/(protected)/goals", "page");
    return { success: true, data: newGoal };
  } catch (error: any) {
    console.error("Create goal failed:", error);
    return { success: false, error: error.message };
  }
}

export async function fundGoalAction(
  _prevState: any,
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return { success: false, error: "UNAUTHORIZED" };
    const userId = session.user.id;

    const rawData = formData.get("data");
    if (!rawData || typeof rawData !== "string") return { success: false, error: "Invalid payload" };

    const parsed = fundGoalSchema.safeParse(JSON.parse(rawData));
    if (!parsed.success) return { success: false, error: "Validation failed" };

    const { goalId, amount } = parsed.data;

    await db.$transaction(async (tx) => {
      // 1. Lock the goal row
      const goal = await tx.goal.findUnique({
        where: { id: goalId, userId }
      });

      if (!goal) throw new Error("Goal not found");
      if (goal.isCompleted) throw new Error("Goal already completed");

      // 2. Fetch and check Savings account
      const savingsAccount = await tx.financialAccount.findUnique({
        where: { id: goal.financialAccountId }
      });

      if (!savingsAccount) throw new Error("Savings account missing");
      if (Number(savingsAccount.balance) < amount) {
        throw new Error("Insufficient free funds in your Savings account to allocate to this goal.");
      }

      // 3. Deduct from Savings
      const updatedSavings = await tx.financialAccount.update({
        where: { id: savingsAccount.id },
        data: { balance: { decrement: amount } }
      });

      // 4. Increment the Goal
      const updatedGoal = await tx.goal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: amount } }
      });

      // 5. Determine completion
      if (Number(updatedGoal.currentAmount) >= Number(updatedGoal.targetAmount)) {
        await tx.goal.update({
          where: { id: goalId },
          data: { isCompleted: true }
        });

        // 6. Notify the user they reached the milestone
        await tx.notification.create({
          data: {
            userId,
            type: "GOAL_REACHED",
            title: "Milestone Achieved",
            body: `Congratulations! You successfully fully funded: ${goal.title}.`,
          }
        });
      }

      // 7. Write Ledger (Internal Transfer from unallocated Savings to allocated Goal)
      // Represented generally as a DEBIT from generic savings. 
      // (Money is technically still in the overall SAVINGS pile conceptually, but we track it accurately here)
      await tx.transactionLedger.create({
        data: {
          financialAccountId: savingsAccount.id,
          amount,
          type: "DEBIT",
          refType: "goal_funding",
          refId: goal.id,
          note: `Transferred to Goal: ${goal.title}`,
          balanceAfter: updatedSavings.balance,
          currency: savingsAccount.currency,
        }
      });
    });

    revalidatePath("/(protected)/goals", "page");
    revalidatePath("/(protected)/accounts", "page");

    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    console.error("Fund goal failed:", error);
    return { success: false, error: error.message };
  }
}
