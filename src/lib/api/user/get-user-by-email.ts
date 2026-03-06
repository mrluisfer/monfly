import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { getUserByEmail } from "~/utils/user/get-user-by-email";

export const getUserByEmailServer = createServerFn({ method: "GET" })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "user:profile",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getUserByEmail(sessionEmail);
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
