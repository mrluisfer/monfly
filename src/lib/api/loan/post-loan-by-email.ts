import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { postLoanByEmail } from "~/server/db/loans/post-loan-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { CreateLoanInputSchema } from "~/zod-schemas/loan-schema";

export const postLoanByEmailServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string(),
      loan: CreateLoanInputSchema,
    })
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "loan:create",
        limit: 10,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await postLoanByEmail(sessionEmail, data.loan);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error creating loan",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
