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

  const startOfThisMonth = new Date(thisYear, thisMonth, 1);
  const startOfNextMonth = new Date(thisYear, thisMonth + 1, 1);

  const startOfPrevMonth = new Date(prevYear, prevMonth, 1);
  const startOfThisMonthAgain = startOfThisMonth;

  const thisMonthResult = await prismaClient.transaction.aggregate({
    where: {
      userEmail: email,
      type: type,
      createdAt: {
        gte: startOfThisMonth,
        lt: startOfNextMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const lastMonthResult = await prismaClient.transaction.aggregate({
    where: {
      userEmail: email,
      type: type,
      createdAt: {
        gte: startOfPrevMonth,
        lt: startOfThisMonthAgain,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const thisMonthTotal = thisMonthResult._sum.amount ?? 0;
  const lastMonthTotal = lastMonthResult._sum.amount ?? 0;

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
