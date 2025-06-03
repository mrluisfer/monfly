import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { useAppSession } from "./session";

export const logoutFn = createServerFn({ method: "POST" })
  .validator((d: { destination?: string; manualRedirect?: boolean }) => d)
  .handler(async ({ data: { destination = "/", manualRedirect = false } }) => {
    try {
      const session = await useAppSession();

      await session.clear();

      if (manualRedirect) {
        return {
          error: false,
          message: "Logout successful",
          data: null,
          success: true,
          statusCode: 200,
        } as ApiResponse<string | null>;
      }
      throw redirect({ href: destination ?? "/" });
    } catch (error) {
      return {
        error: true,
        message: "Error logging out",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<string | null>;
    }
  });
