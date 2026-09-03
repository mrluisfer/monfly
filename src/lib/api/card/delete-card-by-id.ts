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
  .validator(z.object({ id: z.uuid() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 15,
        scope: "card:delete",
        windowMs: 20_000,
      });

      return await deleteCardById(sessionEmail, data.id);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error deleting card",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
