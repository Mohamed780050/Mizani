import db from "@/lib/db";

/**
 * Centralized subscription data access.
 * All plan checks route through here — never query db.subscription directly.
 */
export const subscriptionModel = {
  /** Get the full subscription row for a user, or null. */
  async getByUser(userId: string) {
    return db.subscription.findUnique({ where: { userId } });
  },

  /** Resolve the user's current plan. Defaults to "free" if no subscription. */
  async getActivePlan(userId: string): Promise<"free" | "pro"> {
    const sub = await db.subscription.findUnique({
      where: { userId },
      select: { plan: true, status: true },
    });

    if (!sub || sub.status !== "active") return "free";
    return sub.plan === "pro" ? "pro" : "free";
  },

  /** Quick boolean: is the user on the Pro plan with an active status? */
  async isPro(userId: string): Promise<boolean> {
    const plan = await this.getActivePlan(userId);
    return plan === "pro";
  },
};
