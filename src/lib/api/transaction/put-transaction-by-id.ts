import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { z } from "zod";

import { putTransactionById as putTransactionByIdUtils } from "../../../utils/transactions/put-transaction-by-id";

export const putTransactionByIdServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: z.object({
        amount: z.number(),
        type: z.string(),
        category: z.string(),
        description: z.string(),
        date: z.date(),
      }),
    })
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "transaction:update",
        limit: 12,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      const ownsTransaction = await prismaClient.transaction.findFirst({
        where: { id: data.id, userEmail: sessionEmail },
        select: { id: true },
      });

      if (!ownsTransaction) {
        return {
          error: true,
          message: "Transaction not found",
          data: null,
          success: false,
          statusCode: 404,
        } as ApiResponse<null>;
      }

      return await putTransactionByIdUtils(data);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Transaction update failed",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
