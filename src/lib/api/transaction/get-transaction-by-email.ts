import { createServerFn } from "@tanstack/react-start";
import { getTransactionsByEmail } from "~/server/db/transactions/get-transactions-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .inputValidator((d: { email: string; limit?: number }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "transaction:list",
        limit: data.limit ?? 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      const result = await getTransactionsByEmail({
        email: sessionEmail,
        limit: data.limit,
      });
      return result;
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Server function error",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
