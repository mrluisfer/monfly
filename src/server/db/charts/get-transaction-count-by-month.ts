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
    // Aggregate in the database instead of loading every transaction row;
    // this stays O(months) in transfer size no matter how large the history.
    const rows = await prismaClient.$queryRaw<{ month: Date; count: number }[]>`
      SELECT date_trunc('month', "date") AS month, COUNT(*)::int AS count
      FROM "Transaction"
      WHERE "userEmail" = ${email}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    type ChartRow = { month: string; year: number; count: number };

    const chartData: ChartRow[] = rows.map((row) => {
      const date = new Date(row.month);
      return {
        // Fixed locale + UTC so labels are deterministic across environments:
        // date_trunc returns UTC timestamps, and local getters could shift the
        // bucket into the previous month on non-UTC machines.
        month: date.toLocaleString("en-US", { month: "long", timeZone: "UTC" }),
        year: date.getUTCFullYear(),
        count: row.count,
      };
    });

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
