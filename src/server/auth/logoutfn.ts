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
    } catch {
      return {
        data: null,
        error: true,
        message: "Error logging out",
        statusCode: 500,
        success: false,
      } as ApiResponse<string | null>;
    }

    if (manualRedirect) {
      return {
        data: null,
        error: false,
        message: "Logout successful",
        statusCode: 200,
        success: true,
      } as ApiResponse<string | null>;
    }

    throw redirect({ href: destination ?? "/" });
  });
