import { Prisma } from "@prisma/client";
import { DAILY_ACTIVITY_DAYS } from "~/constants/daily-activity";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export interface DailyActivityRow {
  count: number;
  /** UTC calendar day in YYYY-MM-DD format. */
  date: string;
  expense: number;
  income: number;
}

/**
 * Daily income/expense totals for the last `DAILY_ACTIVITY_DAYS` days,
 * aggregated in the database (O(days) transfer size regardless of history
 * length). Buckets are UTC calendar days, matching the month bucketing of the
 * other chart queries.
 */
export const getDailyActivity = async ({
  email,
  cardId,
}: {
  email: string;
  cardId?: string | null;
}) => {
  try {
    const now = new Date();
    const windowStart = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - (DAILY_ACTIVITY_DAYS - 1),
      ),
    );
    // Exclusive upper bound at tomorrow 00:00 UTC: the grid stops at today, so
    // future-dated rows would otherwise inflate the active-day count and could
    // win "busiest day" without ever being drawn.
    const windowEnd = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
    );

    const cardFilter = cardId
      ? Prisma.sql`AND "cardId" = ${cardId}`
      : Prisma.empty;

    // `day` comes back as text, not a timestamp: the pg driver reads
    // `timestamp without time zone` as a *local* Date, so on a server running
    // ahead of UTC `toISOString()` would shift every bucket a day earlier.
    const rows = await prismaClient.$queryRaw<
      { day: string; income: number; expense: number; count: number }[]
    >`
      SELECT to_char(date_trunc('day', "date"), 'YYYY-MM-DD') AS day,
             COALESCE(SUM(CASE WHEN "type" = 'income' THEN "amount" END), 0)::float AS income,
             COALESCE(SUM(CASE WHEN "type" = 'expense' THEN "amount" END), 0)::float AS expense,
             COUNT(*)::int AS count
      FROM "Transaction"
      WHERE "userEmail" = ${email}
        AND "date" >= ${windowStart}
        AND "date" < ${windowEnd}
        ${cardFilter}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const data: DailyActivityRow[] = rows.map((row) => ({
      count: row.count,
      date: row.day,
      expense: row.expense,
      income: row.income,
    }));

    return {
      data,
      error: false,
      message: "Daily activity retrieved successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<DailyActivityRow[]>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Failed to retrieve daily activity",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
