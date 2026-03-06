import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { putCategoryById } from "~/utils/category/put-category-by-id";
import z from "zod";

export const putCategoryByIdServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      categoryId: z.string(),
      name: z.string(),
      icon: z.string(),
    })
  )
  .handler(async ({ data: { categoryId, name, icon } }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "category:update",
        limit: 12,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      const ownsCategory = await prismaClient.category.findFirst({
        where: { id: categoryId, userEmail: sessionEmail },
        select: { id: true },
      });

      if (!ownsCategory) {
        return {
          success: false,
          message: "Category not found",
          data: null,
          error: true,
          statusCode: 404,
        } as ApiResponse<null>;
      }

      return await putCategoryById({ categoryId, name, icon });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        success: false,
        message: "Error updating category",
        data: null,
        error: true,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
