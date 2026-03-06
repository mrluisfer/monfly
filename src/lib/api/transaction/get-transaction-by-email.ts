import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { getTransactionsByEmail } from "~/utils/transactions/get-transactions-by-email";

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "transaction:list",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      const result = await getTransactionsByEmail({ email: sessionEmail });
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
