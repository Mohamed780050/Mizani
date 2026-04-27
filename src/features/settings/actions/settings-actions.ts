"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { settingsModel } from "../model/settings-model";

const updateAllocationsSchema = z.object({
  EXPENSES: z.number().min(0).max(100),
  INVESTMENT: z.number().min(0).max(100),
  SAVINGS: z.number().min(0).max(100),
  CHARITY: z.number().min(0).max(100),
}).refine((p) => Object.values(p).reduce((a, b) => a + b, 0) === 100, {
  message: "Allocation percentages must sum to 100",
});

const updatePrefsSchema = z.object({
  notifRecurring: z.boolean(),
  notifBudgetAlert: z.boolean(),
  notifGoal: z.boolean(),
  theme: z.string(),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: any };

export async function updateAllocationsAction(
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

    const parsed = updateAllocationsSchema.safeParse(JSON.parse(rawData));
    if (!parsed.success) return { success: false, error: "Validation failed" };

    await settingsModel.updateAllocations(userId, parsed.data);

    revalidatePath("/(protected)/settings", "page");
    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePreferencesAction(
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

    const parsed = updatePrefsSchema.safeParse(JSON.parse(rawData));
    if (!parsed.success) return { success: false, error: "Validation failed" };

    await settingsModel.updatePreferences(userId, parsed.data);

    revalidatePath("/(protected)/settings", "page");
    return { success: true, data: { status: "COMPLETED" } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
