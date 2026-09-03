import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCategoryByEmail } from "~/server/db/categories/get-category-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getCategoryByEmailServer = createServerFn({
  method: "GET",
})
  .validator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 120,
        scope: "category:list",
        windowMs: 60_000,
      });

      return await getCategoryByEmail(sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Failed to get categories",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
