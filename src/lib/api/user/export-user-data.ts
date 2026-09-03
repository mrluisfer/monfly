import { createServerFn } from "@tanstack/react-start";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

/** Everything we hold for the session user, ready to serialize as JSON. */
export const exportUserDataServer = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const sessionEmail = await resolveSessionEmail();
      // Heavy query: a few exports a minute is plenty.
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 5,
        scope: "user:export",
        windowMs: 60_000,
      });

      const where = { userEmail: sessionEmail };
      const [
        user,
        transactions,
        loans,
        categories,
        cards,
        budgets,
        pots,
        recurringBills,
        monthlySummaries,
      ] = await prismaClient.$transaction([
        prismaClient.user.findUniqueOrThrow({
          // Never export the password hash.
          omit: { password: true },
          where: { email: sessionEmail },
        }),
        prismaClient.transaction.findMany({ orderBy: { date: "desc" }, where }),
        prismaClient.loan.findMany({ orderBy: { issuedAt: "desc" }, where }),
        prismaClient.category.findMany({ orderBy: { name: "asc" }, where }),
        prismaClient.card.findMany({ orderBy: { createdAt: "asc" }, where }),
        prismaClient.budget.findMany({ orderBy: { startDate: "desc" }, where }),
        prismaClient.pot.findMany({ orderBy: { createdAt: "asc" }, where }),
        prismaClient.recurringBill.findMany({
          orderBy: { nextDueDate: "asc" },
          where,
        }),
        prismaClient.monthlySummary.findMany({
          orderBy: [{ year: "desc" }, { month: "desc" }],
          where,
        }),
      ]);

      return {
        data: {
          budgets,
          cards,
          categories,
          // ponytail: no version field until the shape actually changes.
          exportedAt: new Date().toISOString(),
          loans,
          monthlySummaries,
          pots,
          recurringBills,
          transactions,
          user,
        },
        error: false,
        message: "Export ready",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error exporting your data",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  },
);
