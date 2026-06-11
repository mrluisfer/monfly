import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";

// 13 full weeks, GitHub-contribution-graph style.
const DAYS_TO_SHOW = 91;

export type DailyActivityRow = {
  /** UTC calendar day in YYYY-MM-DD format. */
  date: string;
  income: number;
  expense: number;
  count: number;
};

/**
 * Daily income/expense totals for the last 13 weeks, aggregated in the
 * database (O(days) transfer size regardless of history length). Buckets are
 * UTC calendar days, matching the month bucketing of the other chart queries.
 */
export const getDailyActivity = async ({ email }: { email: string }) => {
  try {
    const now = new Date();
    const windowStart = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - (DAYS_TO_SHOW - 1),
      ),
    );

    const rows = await prismaClient.$queryRaw<
      { day: Date; income: number; expense: number; count: number }[]
    >`
      SELECT date_trunc('day', "date") AS day,
             COALESCE(SUM(CASE WHEN "type" = 'income' THEN "amount" END), 0)::float AS income,
             COALESCE(SUM(CASE WHEN "type" = 'expense' THEN "amount" END), 0)::float AS expense,
             COUNT(*)::int AS count
      FROM "Transaction"
      WHERE "userEmail" = ${email}
        AND "date" >= ${windowStart}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const data: DailyActivityRow[] = rows.map((row) => ({
      date: row.day.toISOString().slice(0, 10),
      income: row.income,
      expense: row.expense,
      count: row.count,
    }));

    return {
      data,
      message: "Daily activity retrieved successfully",
      success: true,
      error: false,
      statusCode: 200,
    } as ApiResponse<DailyActivityRow[]>;
  } catch {
    return {
      data: null,
      message: "Failed to retrieve daily activity",
      success: false,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
