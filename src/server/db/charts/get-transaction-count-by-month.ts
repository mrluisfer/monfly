import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";

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
    // Track the numeric month index alongside the label so we can sort
    // chronologically without re-parsing the (locale-dependent) month name.
    const summaryMap = new Map<string, ChartRow & { monthIndex: number }>();

    transactions.forEach((t: { date: Date }) => {
      const date = new Date(t.date);
      // Fixed locale so labels are deterministic across environments
      // ("default" would yield e.g. "enero" on a Spanish-locale machine, which
      // then broke the sort below: new Date("enero 1, 2024") is Invalid Date).
      const month = date.toLocaleString("en-US", { month: "long" });
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${monthIndex}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, { month, year, count: 0, monthIndex });
      }
      summaryMap.get(key)!.count += 1;
    });

    const chartData: ChartRow[] = Array.from(summaryMap.values())
      .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)
      .map(({ monthIndex: _monthIndex, ...row }) => row);

    return {
      data: chartData,
      message: "Transactions by month retrieved successfully",
      success: true,
      error: false,
      statusCode: 200,
    } as ApiResponse<typeof chartData>;
  } catch {
    return {
      data: null,
      message: "Failed to retrieve transactions by month",
      success: false,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
