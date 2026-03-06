import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { deleteCategoriesById } from "~/utils/category/delete-categories-by-id";
import { z } from "zod";

export const deleteCategoriesByIdServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      ids: z.array(z.string()),
    })
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "category:delete-many",
        limit: 8,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      const ownedCategoriesCount = await prismaClient.category.count({
        where: {
          id: { in: data.ids },
          userEmail: sessionEmail,
        },
      });

      if (ownedCategoriesCount !== data.ids.length) {
        return {
          success: false,
          message: "Some categories were not found",
          data: null,
          error: true,
          statusCode: 404,
        } as ApiResponse<null>;
      }

      return deleteCategoriesById(data.ids);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        success: false,
        message: "Error deleting categories",
        data: null,
        error: true,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
