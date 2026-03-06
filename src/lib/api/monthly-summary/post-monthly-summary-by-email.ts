import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";

import { postMonthlySummaryByEmail as postMonthlySummaryByEmailUtils } from "../../../utils/monthly-summary/post-monthly-summary-by-email";

export const postMonthlySummaryByEmailServer = createServerFn({
  method: "POST",
})
  .inputValidator((d: { email: string }) => d)
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
