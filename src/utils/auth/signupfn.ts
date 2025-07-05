import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      // Check if the user already exists
      const found = await prismaClient.user.findUnique({
        where: {
          email: data.email,
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
          email: data.email,
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
      return {
        error: true,
        message: "Error signing up",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<string | null>;
    }
  });
