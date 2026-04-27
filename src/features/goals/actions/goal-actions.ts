"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { goalModel } from "../model/goal-model";
import { PlanLimitError, NotFoundError, InsufficientFundsError } from "@/lib/errors";

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

    // Check plan limits (throws PlanLimitError)
    await goalModel.checkPlanLimits(userId);

    const newGoal = await goalModel.create(userId, parsed.data);

    revalidatePath("/(protected)/goals", "page");
    return { 
      success: true, 
      data: {
        ...newGoal,
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: Number(newGoal.currentAmount)
      }
    };
  } catch (error: any) {
    if (error instanceof PlanLimitError) {
      return { success: false, error: error.message };
    }
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

    await goalModel.fund(userId, parsed.data);

    revalidatePath("/(protected)/goals", "page");
    revalidatePath("/(protected)/accounts", "page");

    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    if (error instanceof InsufficientFundsError || error instanceof NotFoundError) {
      return { success: false, error: error.message };
    }
    console.error("Fund goal failed:", error);
    return { success: false, error: error.message };
  }
}
