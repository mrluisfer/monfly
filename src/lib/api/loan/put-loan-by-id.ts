import { createServerFn } from "@tanstack/react-start";

import { putLoanById } from "~/server/db/loans/put-loan-by-id";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { UpdateLoanInputSchema } from "~/zod-schemas/loan-schema";

export const putLoanByIdServer = createServerFn({ method: "POST" })
  .validator(UpdateLoanInputSchema)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 30,
        scope: "loan:update",
        windowMs: 20_000,
      });

      return await putLoanById(sessionEmail, data);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error updating loan",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
