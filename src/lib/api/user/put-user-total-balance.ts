import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { z } from "zod";

import { putUserTotalBalance as putUserTotalBalanceUtils } from "../../../utils/user/put-user-total-balance";

export const putUserTotalBalanceServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      totalBalance: z.number(),
      email: z.string().email(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "user:balance:update",
        limit: 12,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await putUserTotalBalanceUtils({
        ...data,
        email: sessionEmail,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        success: false,
        message: "Error updating user balance",
        data: null,
        error: true,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
