import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { getUserById } from "~/utils/user/get-user-by-id";

export const getUserByIdServer = createServerFn({ method: "GET" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "user:by-id",
        limit: 60,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      const targetUser = await prismaClient.user.findUnique({
        where: { id: data.userId },
        select: { email: true },
      });

      if (!targetUser || targetUser.email !== sessionEmail) {
        return {
          error: true,
          message: "User not found",
          data: null,
          success: false,
          statusCode: 404,
        } as ApiResponse<null>;
      }

      return await getUserById(data.userId);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error fetching user",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
