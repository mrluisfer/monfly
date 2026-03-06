import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { postCategoryByEmail } from "~/utils/category/post-category-by-email";
import z from "zod";

export const postCategoryByEmailServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string(),
      category: z.object({
        name: z.string(),
        icon: z.string(),
      }),
    })
  )
  .handler(async ({ data: { email, category } }) => {
    try {
      const sessionEmail = await resolveSessionEmail(email);
      enforceRateLimit({
        scope: "category:create",
        limit: 8,
        windowMs: 30_000,
        identifier: sessionEmail,
      });

      return await postCategoryByEmail(category, sessionEmail);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        success: false,
        message: "Error posting category",
        data: null,
        error: true,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
