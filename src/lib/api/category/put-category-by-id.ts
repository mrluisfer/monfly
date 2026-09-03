import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { putCategoryById } from "~/server/db/categories/put-category-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const putCategoryByIdServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      categoryId: z.string(),
      icon: z.string(),
      name: z.string(),
    }),
  )
  .handler(async ({ data: { categoryId, name, icon } }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 12,
        scope: "category:update",
        windowMs: 20_000,
      });

      const ownsCategory = await prismaClient.category.findFirst({
        select: { id: true },
        where: { id: categoryId, userEmail: sessionEmail },
      });

      if (!ownsCategory) {
        return {
          data: null,
          error: true,
          message: "Category not found",
          statusCode: 404,
          success: false,
        } as ApiResponse<null>;
      }

      return await putCategoryById({ categoryId, icon, name });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error updating category",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
