import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { updateUserPassword } from "~/server/db/users/update-user-password";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const changePasswordServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 5,
        scope: "user:password:update",
        windowMs: 5 * 60_000,
      });

      return await updateUserPassword({
        currentPassword: data.currentPassword,
        email: sessionEmail,
        newPassword: data.newPassword,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error updating password",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
