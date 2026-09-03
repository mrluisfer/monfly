import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcrypt";
import {
  enforceRateLimit,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";
import { useAppSession } from "./session";

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    try {
      const inputEmail = data.email.trim();
      const normalizedEmail = inputEmail.toLowerCase();
      enforceRateLimit({
        identifier: normalizedEmail,
        limit: 8,
        scope: "auth:login",
        windowMs: 60_000,
      });

      // Find the user
      const user = await prismaClient.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      // Check if the user exists
      if (!user) {
        return {
          data: null,
          error: true,
          message: "User not found",
          statusCode: 404,
          success: false,
          userNotFound: true,
        } as ApiResponse<string | null>;
      }

      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password,
      );

      if (!isPasswordCorrect) {
        return {
          error: true,
          message: "Incorrect password",
          statusCode: 401,
          success: false,
        } as ApiResponse<string>;
      }

      // Create a session
      const session = await useAppSession();

      // Store the user's email in the session
      await session.update({
        email: user.email,
      });

      return {
        data: user.email,
        error: false,
        message: "Login successful",
        statusCode: 200,
        success: true,
      } as ApiResponse<string>;
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<string | null>;
      }

      return {
        data: null,
        error: true,
        message: "Error logging in",
        statusCode: 500,
        success: false,
      } as ApiResponse<string | null>;
    }
  });
