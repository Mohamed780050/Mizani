import db from "@/lib/db";
import { PlanLimitError, InsufficientFundsError, NotFoundError } from "@/lib/errors";

export type CreateGoalInput = {
  title: string;
  targetAmount: number;
  deadline?: Date;
};

export type FundGoalInput = {
  goalId: string;
  amount: number;
};

export const goalModel = {
  async checkPlanLimits(userId: string) {
    const activeSub = await db.subscription.findFirst({
      where: { userId, status: "active" },
    });
    const isPro = activeSub?.plan === "pro" || activeSub?.plan === "max";

    if (!isPro) {
      const goalCount = await db.goal.count({ where: { userId } });
      if (goalCount >= 1) {
        throw new PlanLimitError("GOAL_LIMIT");
      }
    }
  },

  async create(userId: string, data: CreateGoalInput) {
    const savingsAccount = await db.financialAccount.findUnique({
      where: { userId_type: { userId, type: "SAVINGS" } },
    });

    if (!savingsAccount) {
      throw new NotFoundError("Savings account not initialized.");
    }

    return db.goal.create({
      data: {
        userId,
        financialAccountId: savingsAccount.id,
        title: data.title,
        targetAmount: data.targetAmount,
        deadline: data.deadline,
      },
    });
  },

  async fund(userId: string, data: FundGoalInput) {
    return db.$transaction(async (tx) => {
      // 1. Lock the goal row
      const goal = await tx.goal.findUnique({
        where: { id: data.goalId, userId },
      });

      if (!goal) throw new NotFoundError("Goal not found");
      if (goal.isCompleted) throw new Error("Goal already completed");

      // 2. Fetch and check Savings account
      const savingsAccount = await tx.financialAccount.findUnique({
        where: { id: goal.financialAccountId },
      });

      if (!savingsAccount) throw new NotFoundError("Savings account missing");
      if (Number(savingsAccount.balance) < data.amount) {
        throw new InsufficientFundsError(
          "Insufficient free funds in your Savings account to allocate to this goal."
        );
      }

      // 3. Deduct from Savings
      const updatedSavings = await tx.financialAccount.update({
        where: { id: savingsAccount.id },
        data: { balance: { decrement: data.amount } },
      });

      // 4. Increment the Goal
      const updatedGoal = await tx.goal.update({
        where: { id: data.goalId },
        data: { currentAmount: { increment: data.amount } },
      });

      const progress =
        Number(updatedGoal.currentAmount) / Number(updatedGoal.targetAmount);
      const prevProgress =
        (Number(updatedGoal.currentAmount) - data.amount) /
        Number(updatedGoal.targetAmount);

      // 5a. Notify at 90% milestone
      if (progress >= 0.9 && prevProgress < 0.9 && progress < 1.0) {
        await tx.notification.create({
          data: {
            userId,
            type: "GOAL_REACHED",
            title: "Almost There!",
            body: `Your goal "${goal.title}" is over 90% funded. Keep going!`,
          },
        });
      }

      // 5b. Determine completion (100%)
      if (progress >= 1.0) {
        await tx.goal.update({
          where: { id: data.goalId },
          data: { isCompleted: true },
        });

        await tx.notification.create({
          data: {
            userId,
            type: "GOAL_REACHED",
            title: "Milestone Achieved",
            body: `Congratulations! You successfully fully funded: ${goal.title}.`,
          },
        });
      }

      // 6. Write Ledger with idempotency key
      await tx.transactionLedger.create({
        data: {
          financialAccountId: savingsAccount.id,
          amount: data.amount,
          type: "DEBIT",
          refType: "goal_funding",
          refId: goal.id,
          note: `Transferred to Goal: ${goal.title}`,
          balanceAfter: updatedSavings.balance,
          currency: savingsAccount.currency,
          idempotencyKey: `goal_fund_${data.goalId}_${Date.now()}`,
        },
      });

      return updatedGoal;
    });
  },
};
