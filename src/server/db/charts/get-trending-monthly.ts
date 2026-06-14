import { prismaClient } from "~/server/prisma";

type TrendingQueryParams = {
  email: string;
  type: "income" | "expense";
  cardId?: string | null;
};

export async function getTrendingMonthly({
  email,
  type,
  cardId,
}: TrendingQueryParams) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const prevMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const startOfPrevMonth = new Date(prevYear, prevMonth, 1);
  const startOfThisMonth = new Date(thisYear, thisMonth, 1);
  const startOfNextMonth = new Date(thisYear, thisMonth + 1, 1);

  // Bucket by the transaction's own `date` (not `createdAt`) so trending
  // agrees with the income/expense chart, and let the DB do the summing
  // instead of loading every row into memory.
  const [thisMonthSum, lastMonthSum] = await Promise.all([
    prismaClient.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userEmail: email,
        type,
        ...(cardId ? { cardId } : {}),
        date: { gte: startOfThisMonth, lt: startOfNextMonth },
      },
    }),
    prismaClient.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userEmail: email,
        type,
        ...(cardId ? { cardId } : {}),
        date: { gte: startOfPrevMonth, lt: startOfThisMonth },
      },
    }),
  ]);

  const thisMonthTotal = thisMonthSum._sum.amount ?? 0;
  const lastMonthTotal = lastMonthSum._sum.amount ?? 0;

  let percentChange = 0;
  if (lastMonthTotal !== 0) {
    percentChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  } else if (thisMonthTotal !== 0) {
    percentChange = 100;
  }

  return {
    thisMonthTotal,
    lastMonthTotal,
    percentChange,
  };
}
