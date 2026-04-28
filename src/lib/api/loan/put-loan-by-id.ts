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
  .inputValidator(UpdateLoanInputSchema)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "loan:update",
        limit: 30,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await putLoanById(sessionEmail, data);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error updating loan",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
