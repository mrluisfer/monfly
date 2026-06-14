import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import { z } from "zod";

import { updateUserPassword } from "~/server/db/users/update-user-password";

export const changePasswordServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "user:password:update",
        limit: 5,
        windowMs: 5 * 60_000,
        identifier: sessionEmail,
      });

      return await updateUserPassword({
        email: sessionEmail,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error updating password",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
