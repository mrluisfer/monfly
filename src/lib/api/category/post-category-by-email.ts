import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { postCategoryByEmail } from "~/server/db/categories/post-category-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const postCategoryByEmailServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      category: z.object({
        icon: z.string(),
        name: z.string(),
      }),
      email: z.string(),
    }),
  )
  .handler(async ({ data: { email, category } }) => {
    try {
      const sessionEmail = await resolveSessionEmail(email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 8,
        scope: "category:create",
        windowMs: 30_000,
      });

      return await postCategoryByEmail(category, sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error posting category",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
