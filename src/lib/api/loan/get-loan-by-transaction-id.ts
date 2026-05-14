import { createServerFn } from "@tanstack/react-start";
import { getLoanByTransactionId } from "~/server/db/loans/get-loan-by-transaction-id";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { z } from "zod";

export const getLoanByTransactionIdServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      transactionId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "loan:get",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getLoanByTransactionId(data.transactionId, sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error fetching loan",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
