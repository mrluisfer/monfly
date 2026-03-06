import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  toSecurityErrorResponse,
} from "~/utils/security/request-protection";

import { hashPassword, prismaClient } from "../prisma";
import { useAppSession } from "./session";

export const signupFn = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      email: string;
      password: string;
      redirectUrl?: string;
      name: string;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const inputEmail = data.email.trim();
      const normalizedEmail = inputEmail.toLowerCase();
      enforceRateLimit({
        scope: "auth:signup",
        limit: 4,
        windowMs: 5 * 60_000,
        identifier: normalizedEmail,
      });

      // Check if the user already exists
      const found = await prismaClient.user.findUnique({
        where: {
          email: inputEmail,
        },
      });

      // Encrypt the password using Sha256 into plaintext
      const password = await hashPassword(data.password);

      // Create a session
      const session = await useAppSession();

      if (found) {
        if (found.password !== password) {
          return {
            error: true,
            userExists: true,
            message: "User already exists",
            success: false,
            statusCode: 400,
            data: null,
          } as ApiResponse<string | null>;
        }

        // Store the user's email in the session
        await session.update({
          email: found.email,
        });

        return {
          error: false,
          message: "User already exists",
          data: found.email,
          success: true,
          statusCode: 200,
        } as ApiResponse<string | null>;
      }

      // Create the user
      const user = await prismaClient.user.create({
        data: {
          email: inputEmail,
          password,
          name: data.name,
        },
      });

      if (user) {
        // Store the user's email in the session
        await session.update({
          email: user.email,
        });

        return {
          error: false,
          message: "User created successfully",
          data: user.email,
          success: true,
          statusCode: 201,
        } as ApiResponse<string | null>;
      }
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<string | null>;
      }

      return {
        error: true,
        message: "Error signing up",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<string | null>;
    }
  });
