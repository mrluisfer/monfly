import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { deleteCategoryById } from "~/utils/category/delete-category-by-id";
import z from "zod";

export const deleteCategoryByIdServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "category:delete",
        limit: 12,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      const ownsCategory = await prismaClient.category.findFirst({
        where: { id: data.id, userEmail: sessionEmail },
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

      return await deleteCategoryById(data.id);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        success: false,
        message: "Failed to delete category",
        data: null,
        error: true,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
