import { prismaClient } from "../prisma";

type TrendingQueryParams = {
  email: string;
  type: "income" | "expense";
};

export async function getTrendingMonthly({ email, type }: TrendingQueryParams) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const prevMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const startOfPrevMonth = new Date(prevYear, prevMonth, 1);
  const startOfThisMonth = new Date(thisYear, thisMonth, 1);
  const startOfNextMonth = new Date(thisYear, thisMonth + 1, 1);

  // Single query: fetch all matching transactions for both months
  const transactions = await prismaClient.transaction.findMany({
    where: {
      userEmail: email,
      type: type,
      createdAt: {
        gte: startOfPrevMonth,
        lt: startOfNextMonth,
      },
    },
    select: { amount: true, createdAt: true },
  });

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;

  for (const t of transactions) {
    const txDate = new Date(t.createdAt);
    if (txDate >= startOfThisMonth) {
      thisMonthTotal += t.amount;
    } else {
      lastMonthTotal += t.amount;
    }
  }

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
