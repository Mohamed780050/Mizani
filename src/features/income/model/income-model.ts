import db from "@/lib/db";
import { AccountType, TransactionType } from "@/generated/prisma/enums";
import { PlanLimitError } from "@/lib/errors";

export type CreateIncomeInput = {
  amount: number;
  source: string;
  date: Date;
  notes?: string;
  allocations: {
    EXPENSES: number;
    INVESTMENT: number;
    SAVINGS: number;
    CHARITY: number;
  };
};

export const incomeModel = {
  async create(userId: string, data: CreateIncomeInput) {
    return db.$transaction(async (tx) => {
      // 1. Create Income Record
      const income = await tx.income.create({
        data: {
          userId,
          amount: data.amount,
          source: data.source,
          date: data.date,
          notes: data.notes,
        },
      });

      // 2. Fetch all 4 target accounts
      const accounts = await tx.financialAccount.findMany({
        where: { userId },
      });

      if (accounts.length < 4) {
        throw new Error("Financial framework is not fully initialized.");
      }

      const accountTypes = [
        AccountType.EXPENSES,
        AccountType.INVESTMENT,
        AccountType.SAVINGS,
        AccountType.CHARITY,
      ];

      for (const type of accountTypes) {
        const percentage = data.allocations[type];
        if (percentage === 0) continue;

        const allocatedAmount = Number(data.amount) * (percentage / 100);
        const account = accounts.find((a) => a.type === type);

        if (!account) throw new Error(`Missing ${type} account.`);

        // a) Record the Allocation Split
        await tx.allocation.create({
          data: {
            incomeId: income.id,
            financialAccountId: account.id,
            amount: allocatedAmount,
            percentage: percentage,
          },
        });

        // b) Increment the balance
        const updatedAccount = await tx.financialAccount.update({
          where: { id: account.id },
          data: { balance: { increment: allocatedAmount } },
        });

        // c) Write the immutable ledger entry with idempotency key
        await tx.transactionLedger.create({
          data: {
            financialAccountId: account.id,
            amount: allocatedAmount,
            type: TransactionType.CREDIT,
            refType: "income",
            refId: income.id,
            note: `Income: ${data.source} (${percentage}%)`,
            balanceAfter: updatedAccount.balance,
            currency: account.currency,
            idempotencyKey: `income_${income.id}_${type}`,
          },
        });
      }

      return income;
    });
  },
};
