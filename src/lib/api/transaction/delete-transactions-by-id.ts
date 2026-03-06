import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { z } from "zod";

import { deleteTransactionsById } from "../../../utils/transactions/delete-transactions-by-id";

export const deleteTransactionsByIdServer = createServerFn({ method: "POST" })
  .inputValidator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "transaction:delete-many",
        limit: 8,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      const ownedTransactionsCount = await prismaClient.transaction.count({
        where: {
          id: { in: data.ids },
          userEmail: sessionEmail,
        },
      });

      if (ownedTransactionsCount !== data.ids.length) {
        return {
          success: false,
          message: "Some transactions were not found",
          data: null,
          error: true,
          statusCode: 404,
        } as ApiResponse<null>;
      }

      return await deleteTransactionsById(data.ids);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        success: false,
        message: "Error deleting transactions",
        data: null,
        error: true,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
