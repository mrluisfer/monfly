import { createServerFn } from "@tanstack/react-start";
import {
  enforceRateLimit,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

import { hashPassword, prismaClient } from "../prisma";
import { useAppSession } from "./session";

export const signupFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      email: string;
      password: string;
      redirectUrl?: string;
      name: string;
      acceptTerms: boolean;
      acceptPrivacy: boolean;
    }) => d,
  )
  .handler(async ({ data }) => {
    try {
      const inputEmail = data.email.trim();
      const normalizedEmail = inputEmail.toLowerCase();

      // Consent is a legal record: never take the client's word for the
      // checkbox being rendered, re-check it here before creating anything.
      if (!(data.acceptTerms && data.acceptPrivacy)) {
        return {
          data: null,
          error: true,
          message:
            "You must accept the Terms & Conditions and the Privacy Policy",
          statusCode: 400,
          success: false,
        } as ApiResponse<string | null>;
      }

      enforceRateLimit({
        identifier: normalizedEmail,
        limit: 4,
        scope: "auth:signup",
        windowMs: 5 * 60_000,
      });

      // Check if the user already exists
      const found = await prismaClient.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      // Encrypt the password using Sha256 into plaintext
      const password = await hashPassword(data.password);

      // Create a session
      const session = await useAppSession();

      if (found) {
        if (found.password !== password) {
          return {
            data: null,
            error: true,
            message: "User already exists",
            statusCode: 400,
            success: false,
            userExists: true,
          } as ApiResponse<string | null>;
        }

        // Store the user's email in the session
        await session.update({
          email: found.email,
        });

        return {
          data: found.email,
          error: false,
          message: "User already exists",
          statusCode: 200,
          success: true,
        } as ApiResponse<string | null>;
      }

      // Create the user. The consent checkboxes are stored as the moment of
      // acceptance, the same shape the account settings form reads back.
      const acceptedAt = new Date();
      const user = await prismaClient.user.create({
        data: {
          acceptedPrivacyAt: acceptedAt,
          acceptedTermsAt: acceptedAt,
          email: normalizedEmail,
          name: data.name,
          password,
        },
      });

      if (user) {
        // Store the user's email in the session
        await session.update({
          email: user.email,
        });

        return {
          data: user.email,
          error: false,
          message: "User created successfully",
          statusCode: 201,
          success: true,
        } as ApiResponse<string | null>;
      }
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<string | null>;
      }

      return {
        data: null,
        error: true,
        message: "Error signing up",
        statusCode: 500,
        success: false,
      } as ApiResponse<string | null>;
    }
  });
