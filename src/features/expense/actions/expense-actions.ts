"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { expenseModel } from "../model/expense-model";
import { PlanLimitError } from "@/lib/errors";
import {
  ExpenseType,
  NecessityType,
  FrequencyType,
} from "@/generated/prisma/enums";

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

    // Check plan limits (throws PlanLimitError)
    await expenseModel.checkPlanLimits(userId, parsed.data.date, parsed.data.frequency);

    // Create the expense atomically
    await expenseModel.create(userId, parsed.data);

    revalidatePath("/(protected)/dashboard", "page");
    revalidatePath("/(protected)/accounts", "page");

    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    if (error instanceof PlanLimitError) {
      return { success: false, error: error.message };
    }
    console.error("Expense addition failed:", error);
    return { success: false, error: error.message || "Failed to process expense." };
  }
}
