import { createServerFn } from "@tanstack/react-start";
import { getLoansByEmail } from "~/server/db/loans/get-loans-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { z } from "zod";

export const getLoansByEmailServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
      status: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "loan:list",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getLoansByEmail({
        email: sessionEmail,
        status: data.status,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error fetching loans",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
