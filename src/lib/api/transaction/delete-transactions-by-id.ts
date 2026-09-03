import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { deleteTransactionsById } from "~/server/db/transactions/delete-transactions-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteTransactionsByIdServer = createServerFn({ method: "POST" })
  .validator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 8,
        scope: "transaction:delete-many",
        windowMs: 20_000,
      });

      const ownedTransactionsCount = await prismaClient.transaction.count({
        where: {
          id: { in: data.ids },
          userEmail: sessionEmail,
        },
      });

      if (ownedTransactionsCount !== data.ids.length) {
        return {
          data: null,
          error: true,
          message: "Some transactions were not found",
          statusCode: 404,
          success: false,
        } as ApiResponse<null>;
      }

      return await deleteTransactionsById(data.ids);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error deleting transactions",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
