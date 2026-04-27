import db from "@/lib/db";

export type UpdateAllocationsInput = {
  EXPENSES: number;
  INVESTMENT: number;
  SAVINGS: number;
  CHARITY: number;
};

export type UpdatePreferencesInput = {
  notifRecurring: boolean;
  notifBudgetAlert: boolean;
  notifGoal: boolean;
  theme: string;
};

export const settingsModel = {
  async updateAllocations(userId: string, data: UpdateAllocationsInput) {
    return db.$transaction(async (tx) => {
      // Fetch the current values to log the diff
      const current = await tx.budgetSetting.findUnique({
        where: { userId },
      });

      await tx.budgetSetting.update({
        where: { userId },
        data: {
          expensesPct: data.EXPENSES,
          investmentPct: data.INVESTMENT,
          savingsPct: data.SAVINGS,
          charityPct: data.CHARITY,
        },
      });

      // Record changes to SettingsHistory
      if (current) {
        const changeLog: Record<string, [number, number]> = {};

        if (Number(current.expensesPct) !== data.EXPENSES) {
          changeLog.expensesPct = [Number(current.expensesPct), data.EXPENSES];
        }
        if (Number(current.investmentPct) !== data.INVESTMENT) {
          changeLog.investmentPct = [Number(current.investmentPct), data.INVESTMENT];
        }
        if (Number(current.savingsPct) !== data.SAVINGS) {
          changeLog.savingsPct = [Number(current.savingsPct), data.SAVINGS];
        }
        if (Number(current.charityPct) !== data.CHARITY) {
          changeLog.charityPct = [Number(current.charityPct), data.CHARITY];
        }

        // Only log if something actually changed
        if (Object.keys(changeLog).length > 0) {
          await tx.settingsHistory.create({
            data: {
              userId,
              changeLog,
            },
          });
        }
      }
    });
  },

  async updatePreferences(userId: string, data: UpdatePreferencesInput) {
    return db.userPreference.upsert({
      where: { userId },
      update: {
        notifRecurring: data.notifRecurring,
        notifBudgetAlert: data.notifBudgetAlert,
        notifGoal: data.notifGoal,
        theme: data.theme,
      },
      create: {
        userId,
        notifRecurring: data.notifRecurring,
        notifBudgetAlert: data.notifBudgetAlert,
        notifGoal: data.notifGoal,
        theme: data.theme,
      },
    });
  },
};
