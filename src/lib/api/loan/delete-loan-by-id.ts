import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { deleteLoanById } from "~/server/db/loans/delete-loan-by-id";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteLoanByIdServer = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "loan:delete",
        limit: 15,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await deleteLoanById(sessionEmail, data.id);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error deleting loan",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
