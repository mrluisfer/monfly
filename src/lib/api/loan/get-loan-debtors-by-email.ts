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
  .validator(
    z.object({
      email: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 120,
        scope: "loan:debtors",
        windowMs: 60_000,
      });

      return await getLoanDebtorsByEmail(sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }
      return {
        data: null,
        error: true,
        message: "Error fetching loan debtors",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
