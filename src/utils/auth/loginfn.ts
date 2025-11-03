import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import bcrypt from "bcrypt";

import { prismaClient } from "../prisma";
import { useAppSession } from "./session";

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    try {
      // Find the user
      const user = await prismaClient.user.findUnique({
        where: {
          email: data.email,
        },
      });

      // Check if the user exists
      if (!user) {
        return {
          error: true,
          userNotFound: true,
          message: "User not found",
          success: false,
          statusCode: 404,
          data: null,
        } as ApiResponse<string | null>;
      }

      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordCorrect) {
        return {
          error: true,
          message: "Incorrect password",
          success: false,
          statusCode: 401,
        } as ApiResponse<string>;
      }

      // Create a session
      const session = await useAppSession();

      // Store the user's email in the session
      await session.update({
        email: user.email,
      });

      return {
        error: false,
        message: "Login successful",
        data: user.email,
        success: true,
        statusCode: 200,
      } as ApiResponse<string>;
    } catch (error) {
      console.log({ error });
      return {
        error: true,
        message: "Error logging in",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<string | null>;
    }
  });
