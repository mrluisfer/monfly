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
        scope: "monthly-summary:get",
        limit: 60,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getMonthlySummaryByEmailUtils({ email: sessionEmail });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error fetching monthly summary",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
