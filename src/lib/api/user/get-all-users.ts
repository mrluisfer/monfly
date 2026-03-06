import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";
import { getAllUsers } from "~/utils/user/get-all-users";
import z from "zod";

export const getAllUsersServer = createServerFn({ method: "GET" })
  .inputValidator(z.object({}).optional().default({}))
  .handler(async () => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "user:list",
        limit: 30,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getAllUsers();
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error fetching users",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
