import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { deleteCategoryById } from "~/server/db/categories/delete-category-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteCategoryByIdServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 12,
        scope: "category:delete",
        windowMs: 20_000,
      });

      const ownsCategory = await prismaClient.category.findFirst({
        select: { id: true },
        where: { id: data.id, userEmail: sessionEmail },
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

      return await deleteCategoryById(data.id);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Failed to delete category",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
