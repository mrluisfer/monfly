import { createServerFn } from "@tanstack/react-start";
import { postMonthlySummaryByEmail as postMonthlySummaryByEmailUtils } from "~/server/db/monthly-summary/post-monthly-summary-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const postMonthlySummaryByEmailServer = createServerFn({
  method: "POST",
})
  .validator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 30,
        scope: "monthly-summary:post",
        windowMs: 60_000,
      });

      return await postMonthlySummaryByEmailUtils({ email: sessionEmail });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error posting monthly summary",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
