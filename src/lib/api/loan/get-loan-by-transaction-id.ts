import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getLoanByTransactionId } from "~/server/db/loans/get-loan-by-transaction-id";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getLoanByTransactionIdServer = createServerFn({ method: "GET" })
  .validator(
    z.object({
      transactionId: z.uuid(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 120,
        scope: "loan:get",
        windowMs: 60_000,
      });

      return await getLoanByTransactionId(data.transactionId, sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error fetching loan",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
