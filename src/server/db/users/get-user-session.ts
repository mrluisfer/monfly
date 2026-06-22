import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "~/server/auth/session";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      // We need to auth on the server so we have access to secure cookies
      const session = await useAppSession();

      if (typeof session === "undefined" || !session.data.email) {
        return {
          error: true,
          message: "User session not found",
          data: null,
          success: false,
          statusCode: 404,
        } as ApiResponse<string | null>;
      }

      // The cookie alone isn't proof the account still exists. A stale/orphaned
      // cookie (user deleted, DB reset, etc.) would otherwise pass every auth
      // gate and then fail on real data fetches — the "Guest + failed requests"
      // symptom. Validate against the DB and clear the cookie if it's invalid,
      // so the session is wrong only once.
      const user = await prismaClient.user.findUnique({
        where: { email: session.data.email },
        select: { email: true },
      });

      if (!user) {
        await session.clear();
        return {
          error: true,
          message: "User session is no longer valid",
          data: null,
          success: false,
          statusCode: 401,
        } as ApiResponse<string | null>;
      }

      return {
        data: user.email,
        error: false,
        success: true,
        statusCode: 200,
        message: "User session fetched successfully",
      } as ApiResponse<string>;
    } catch {
      return {
        error: true,
        message: "Error fetching user session",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<string | null>;
    }
  },
);
