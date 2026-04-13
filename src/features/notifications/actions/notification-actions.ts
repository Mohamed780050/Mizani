"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return { success: true, data: notifications };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markNotificationsReadAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
       return { success: false, error: "UNAUTHORIZED" };
    }

    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true }
    });

    revalidatePath("/(protected)/dashboard", "page");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
