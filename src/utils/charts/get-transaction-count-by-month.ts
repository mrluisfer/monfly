import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

/**
 * @returns [{ month: "January", year: 2024, count: 5 }, ...]
 * @param {string} email
 */
export const getTransactionsCountByMonth = async ({
  email,
}: {
  email: string;
}) => {
  try {
    const transactions = await prismaClient.transaction.findMany({
      where: { userEmail: email },
      select: { date: true },
      orderBy: { date: "asc" },
    });

    type ChartRow = { month: string; year: number; count: number };
    const summaryMap = new Map<string, ChartRow>();

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, { month, year, count: 0 });
      }
      summaryMap.get(key)!.count += 1;
    });

    const chartData = Array.from(summaryMap.values()).sort(
      (a, b) =>
        a.year - b.year ||
        new Date(`${a.month} 1, ${a.year}`).getMonth() -
          new Date(`${b.month} 1, ${b.year}`).getMonth()
    );

    return {
      data: chartData,
      message: "Transactions by month retrieved successfully",
      success: true,
      error: false,
      statusCode: 200,
    } as ApiResponse<typeof chartData>;
  } catch (error) {
    return {
      data: null,
      message: "Failed to retrieve transactions by month",
      success: false,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
