import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { z } from "zod";

import { deleteTransactionById as deleteTransactionByIdUtils } from "../../../utils/transactions/delete-transaction-by-id";

export const deleteTransactionByIdServer = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "transaction:delete",
        limit: 15,
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

      return await deleteTransactionByIdUtils(data.id);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Transaction deletion failed",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
