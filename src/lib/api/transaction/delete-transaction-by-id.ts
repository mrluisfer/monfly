import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { deleteTransactionById as deleteTransactionByIdUtils } from "~/server/db/transactions/delete-transaction-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteTransactionByIdServer = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 15,
        scope: "transaction:delete",
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

      return await deleteTransactionByIdUtils(data.id);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Transaction deletion failed",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
