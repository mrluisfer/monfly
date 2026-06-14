import { Prisma } from "@prisma/client";
import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";

const monthsToShow = 6;

export const getIncomeExpenseData = async ({
  email,
  cardId,
}: {
  email: string;
  cardId?: string | null;
}) => {
  try {
    const now = new Date();
    // Work in UTC end-to-end: stored dates are UTC and date_trunc below
    // returns UTC, so the month frame must be built the same way or buckets
    // could shift by one month on non-UTC machines.
    const windowStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsToShow + 1, 1),
    );

    // Aggregate in the database instead of loading every transaction row;
    // this stays O(months) in transfer size no matter how large the history.
    const cardFilter = cardId
      ? Prisma.sql`AND "cardId" = ${cardId}`
      : Prisma.empty;

    const rows = await prismaClient.$queryRaw<
      { month: Date; type: string; total: number }[]
    >`
      SELECT date_trunc('month', "date") AS month,
             "type",
             SUM("amount")::float AS total
      FROM "Transaction"
      WHERE "userEmail" = ${email}
        AND "date" >= ${windowStart}
        AND "date" <= ${now}
        ${cardFilter}
      GROUP BY 1, 2
    `;

    type ChartRow = {
      month: string;
      year: number;
      income: number;
      expense: number;
    };

    const summaryMap = new Map<string, ChartRow>();
    for (const row of rows) {
      const date = new Date(row.month);
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          // Fixed locale so labels are deterministic across environments
          // ("default" yields e.g. "enero" on a Spanish-locale machine).
          month: date.toLocaleString("en-US", {
            month: "long",
            timeZone: "UTC",
          }),
          year: date.getUTCFullYear(),
          income: 0,
          expense: 0,
        });
      }
      const entry = summaryMap.get(key)!;
      if (row.type === "income") entry.income = row.total;
      if (row.type === "expense") entry.expense = row.total;
    }

    // Fill the full window so months without transactions still chart as 0.
    const chartData: ChartRow[] = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
      );
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      chartData.push(
        summaryMap.get(key) ?? {
          month: date.toLocaleString("en-US", {
            month: "long",
            timeZone: "UTC",
          }),
          year: date.getUTCFullYear(),
          income: 0,
          expense: 0,
        },
      );
    }

    return {
      data: chartData,
      message: "Income and expense data retrieved successfully",
      success: true,
      error: false,
      statusCode: 200,
    } as ApiResponse<typeof chartData>;
  } catch {
    return {
      data: null,
      message: "Failed to retrieve income and expense data",
      success: false,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
