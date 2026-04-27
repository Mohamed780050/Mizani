"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const upsertBudgetSchema = z.object({
  categoryId: z.string().min(1),
  limit: z.number().positive().multipleOf(0.01),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024).max(2100),
});

const deleteBudgetSchema = z.object({
  budgetId: z.string().min(1),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: any };

export async function upsertBudgetAction(
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
    if (!rawData || typeof rawData !== "string") {
      return { success: false, error: "Invalid payload" };
    }

    const parsed = upsertBudgetSchema.safeParse(JSON.parse(rawData));
    if (!parsed.success) {
      return { success: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const { categoryId, limit, month, year } = parsed.data;

    // Verify category belongs to user
    const category = await db.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    // --- Plan Enforcement: Free users limited to 3 budget categories ---
    const activeSub = await db.subscription.findFirst({
      where: { userId, status: "active" },
    });
    const isPro = activeSub?.plan === "pro" || activeSub?.plan === "max";

    if (!isPro) {
      // Count distinct categories with budgets (not counting the current one if updating)
      const existingBudgets = await db.budget.findMany({
        where: { userId },
        select: { categoryId: true },
        distinct: ["categoryId"],
      });

      const uniqueCategories = new Set(existingBudgets.map((b) => b.categoryId));

      // If this category doesn't already have a budget, check the limit
      if (!uniqueCategories.has(categoryId) && uniqueCategories.size >= 3) {
        return { success: false, error: "BUDGET_LIMIT" };
      }
    }

    await db.budget.upsert({
      where: {
        userId_categoryId_month_year: { userId, categoryId, month, year },
      },
      update: { limit },
      create: {
        userId,
        categoryId,
        limit,
        month,
        year,
      },
    });

    revalidatePath("/(protected)/budgets", "page");
    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    console.error("Budget upsert failed:", error);
    return { success: false, error: error.message || "Failed to save budget" };
  }
}

export async function deleteBudgetAction(
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
    if (!rawData || typeof rawData !== "string") {
      return { success: false, error: "Invalid payload" };
    }

    const parsed = deleteBudgetSchema.safeParse(JSON.parse(rawData));
    if (!parsed.success) {
      return { success: false, error: "Validation failed" };
    }

    // Verify ownership
    const budget = await db.budget.findFirst({
      where: { id: parsed.data.budgetId, userId },
    });

    if (!budget) {
      return { success: false, error: "Budget not found" };
    }

    await db.budget.delete({
      where: { id: parsed.data.budgetId },
    });

    revalidatePath("/(protected)/budgets", "page");
    return { success: true, data: { status: "DELETED" } };
  } catch (error: any) {
    console.error("Budget delete failed:", error);
    return { success: false, error: error.message || "Failed to delete budget" };
  }
}
