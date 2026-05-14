import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "~/server/auth/session";
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

      return {
        data: session.data.email,
        error: false,
        success: true,
        statusCode: 200,
        message: "User session fetched successfully",
      } as ApiResponse<string>;
    } catch (error) {
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
