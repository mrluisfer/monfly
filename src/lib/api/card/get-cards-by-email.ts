import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCardsByEmail } from "~/server/db/cards/get-cards-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const getCardsByEmailServer = createServerFn({ method: "GET" })
  .validator(
    z.object({
      email: z.string(),
      status: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 120,
        scope: "card:list",
        windowMs: 60_000,
      });

      return await getCardsByEmail({
        email: sessionEmail,
        status: data.status,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error fetching cards",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
