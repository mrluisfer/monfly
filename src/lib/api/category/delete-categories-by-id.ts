import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { deleteCategoriesById } from "~/server/db/categories/delete-categories-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteCategoriesByIdServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ids: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 8,
        scope: "category:delete-many",
        windowMs: 20_000,
      });

      const ownedCategoriesCount = await prismaClient.category.count({
        where: {
          id: { in: data.ids },
          userEmail: sessionEmail,
        },
      });

      if (ownedCategoriesCount !== data.ids.length) {
        return {
          data: null,
          error: true,
          message: "Some categories were not found",
          statusCode: 404,
          success: false,
        } as ApiResponse<null>;
      }

      return deleteCategoriesById(data.ids);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error deleting categories",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
