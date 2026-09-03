import { createServerFn } from "@tanstack/react-start";
import { getMonthlySummaryByEmail as getMonthlySummaryByEmailUtils } from "~/server/db/monthly-summary/get-monthly-summary-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getMonthlySummaryByEmailServer = createServerFn({ method: "GET" })
  .validator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 60,
        scope: "monthly-summary:get",
        windowMs: 60_000,
      });

      return await getMonthlySummaryByEmailUtils({ email: sessionEmail });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error fetching monthly summary",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
