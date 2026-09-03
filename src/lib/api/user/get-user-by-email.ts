import { createServerFn } from "@tanstack/react-start";
import { getUserByEmail } from "~/server/db/users/get-user-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getUserByEmailServer = createServerFn({ method: "GET" })
  .validator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 120,
        scope: "user:profile",
        windowMs: 60_000,
      });

      return await getUserByEmail(sessionEmail);
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
