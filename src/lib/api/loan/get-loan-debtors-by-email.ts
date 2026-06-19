import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getLoanDebtorsByEmail } from "~/server/db/loans/get-loan-debtors-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getLoanDebtorsByEmailServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "loan:debtors",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getLoanDebtorsByEmail(sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }
      return {
        error: true,
        message: "Error fetching loan debtors",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
