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
  .validator(
    z.object({
      avatarSeed: z.string().max(120).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 30,
        scope: "user:avatar:update",
        windowMs: 20_000,
      });

      return await updateUserAvatar({
        avatarSeed: data.avatarSeed,
        email: sessionEmail,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error updating avatar",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
