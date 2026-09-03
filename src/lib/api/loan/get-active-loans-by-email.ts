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
  .validator(
    z.object({
      email: z.string(),
      includeId: z.uuid().nullable().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 120,
        scope: "loan:active",
        windowMs: 60_000,
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
        data: null,
        error: true,
        message: "Error fetching active loans",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
