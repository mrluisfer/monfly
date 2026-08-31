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
        scope: "category:list",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getCategoryByEmail(sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        success: false,
        message: "Failed to get categories",
        data: null,
        error: true,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
