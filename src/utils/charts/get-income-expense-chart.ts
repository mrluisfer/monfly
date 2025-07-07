import { ApiResponse } from "~/types/ApiResponse";
import { format } from "date-fns";

import { prismaClient } from "../prisma";

const now = new Date();
const monthsToShow = 6;
const sixMonthsAgo = new Date(
  now.getFullYear(),
  now.getMonth() - monthsToShow + 1,
  1
);

export const getIncomeExpenseData = async ({ email }: { email: string }) => {
  try {
    const transactions = await prismaClient.transaction.findMany({
      where: {
        userEmail: email,
        date: { gte: sixMonthsAgo, lte: now },
      },
      orderBy: { date: "asc" },
    });

    type ChartRow = {
      month: string;
      year: number;
      income: number;
      expense: number;
    };

    const months: { month: string; year: number }[] = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
      });
    }

    const summaryMap = new Map<string, ChartRow>();
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, { month, year, income: 0, expense: 0 });
      }
      if (t.type === "income") summaryMap.get(key)!.income += t.amount;
      if (t.type === "expense") summaryMap.get(key)!.expense += t.amount;
    });

    const chartData: ChartRow[] = months.map(({ month, year }) => {
      const key = `${year}-${month}`;
      return summaryMap.get(key) ?? { month, year, income: 0, expense: 0 };
    });

    return {
      data: chartData,
      message: "Income and expense data retrieved successfully",
      success: true,
      error: false,
      statusCode: 200,
    } as ApiResponse<typeof chartData>;
  } catch (error) {
    return {
      data: null,
      message: "Failed to retrieve income and expense data",
      success: false,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
