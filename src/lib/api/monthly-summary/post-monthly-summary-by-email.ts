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
        scope: "monthly-summary:post",
        limit: 30,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await postMonthlySummaryByEmailUtils({ email: sessionEmail });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error posting monthly summary",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
