import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { putTransactionById as putTransactionByIdUtils } from "~/server/db/transactions/put-transaction-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const putTransactionByIdServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      data: z.object({
        amount: z.number(),
        appliedToLoanId: z.uuid().nullable().optional(),
        cardId: z.uuid().nullable().optional(),
        category: z.string(),
        date: z.date(),
        description: z.string(),
        type: z.string(),
      }),
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 12,
        scope: "transaction:update",
        windowMs: 20_000,
      });

      const ownsTransaction = await prismaClient.transaction.findFirst({
        select: { id: true },
        where: { id: data.id, userEmail: sessionEmail },
      });

      if (!ownsTransaction) {
        return {
          data: null,
          error: true,
          message: "Transaction not found",
          statusCode: 404,
          success: false,
        } as ApiResponse<null>;
      }

      return await putTransactionByIdUtils(data);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Transaction update failed",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
