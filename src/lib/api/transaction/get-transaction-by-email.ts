import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getTransactionsByEmail } from "~/server/db/transactions/get-transactions-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

const MAX_TRANSACTION_LIMIT = 1000;
const DEFAULT_TRANSACTION_LIMIT = 100;

const GetTransactionsInputSchema = z.object({
  cardId: z.uuid().nullable().optional(),
  email: z.string(),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_TRANSACTION_LIMIT)
    .optional(),
});

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .validator(GetTransactionsInputSchema)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 120,
        scope: "transaction:list",
        windowMs: 60_000,
      });

      const result = await getTransactionsByEmail({
        cardId: data.cardId,
        email: sessionEmail,
        limit: data.limit ?? DEFAULT_TRANSACTION_LIMIT,
      });
      return result;
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Server function error",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
