import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getActiveLoansByEmail } from "~/server/db/loans/get-active-loans-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getActiveLoansByEmailServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
      includeId: z.string().uuid().nullable().optional(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "loan:active",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getActiveLoansByEmail(sessionEmail, {
        includeId: data.includeId,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }
      return {
        error: true,
        message: "Error fetching active loans",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
