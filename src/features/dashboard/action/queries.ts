import db from "@/lib/db";

/**
 * Fetches all financial accounts associated with the given user.
 */
export async function getFinancialAccounts(userId: string) {
  return db.financialAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" }
  });
}

/**
 * Fetches the most recent ledger transactions for the given user.
 */
export async function getRecentTransactions(userId: string, limit = 5) {
  return db.transactionLedger.findMany({
    where: { financialAccount: { userId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { financialAccount: true }
  });
}
