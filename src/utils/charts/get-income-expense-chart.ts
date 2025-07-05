import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

const now = new Date();
const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

/**
 * @returns
 * [{ month: "January", year: 2024, income: 400, expense: 200 },{ month: "February", year: 2024, income: 320, expense: 250 },...]
 */
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

    const chartData = Array.from(summaryMap.values()).sort(
      (a, b) =>
        a.year - b.year ||
        new Date(`${a.month} 1, ${a.year}`).getMonth() -
          new Date(`${b.month} 1, ${b.year}`).getMonth()
    );

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
