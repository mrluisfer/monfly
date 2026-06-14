import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { deleteCardById } from "~/server/db/cards/delete-card-by-id";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteCardByIdServer = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "card:delete",
        limit: 15,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await deleteCardById(sessionEmail, data.id);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error deleting card",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
