import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { updateUserAvatar } from "~/server/db/users/update-user-avatar";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const updateUserAvatarServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      avatarSeed: z.string().max(120).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "user:avatar:update",
        limit: 30,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await updateUserAvatar({
        email: sessionEmail,
        avatarSeed: data.avatarSeed,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error updating avatar",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
