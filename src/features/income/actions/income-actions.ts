"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { incomeModel } from "../model/income-model";

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

    await incomeModel.create(userId, parsed.data);

    revalidatePath("/(protected)/dashboard", "page");
    revalidatePath("/(protected)/accounts", "page");

    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    console.error("Income addition failed:", error);
    return { success: false, error: error.message || "Failed to process income." };
  }
}
