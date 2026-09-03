import { createServerFn } from "@tanstack/react-start";
import { getUserById } from "~/server/db/users/get-user-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getUserByIdServer = createServerFn({ method: "GET" })
  .validator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 60,
        scope: "user:by-id",
        windowMs: 60_000,
      });

      const targetUser = await prismaClient.user.findUnique({
        select: { email: true },
        where: { id: data.userId },
      });

      if (!targetUser || targetUser.email !== sessionEmail) {
        return {
          data: null,
          error: true,
          message: "User not found",
          statusCode: 404,
          success: false,
        } as ApiResponse<null>;
      }

      return await getUserById(data.userId);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error fetching user",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
