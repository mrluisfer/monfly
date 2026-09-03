import type { User } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import { withDatabaseTimeout } from "~/utils/timeout";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await withDatabaseTimeout(() =>
      prismaClient.user.findUnique({
        where: { email },
      }),
    );

    if (!user) {
      return {
        data: null,
        error: true,
        message: "User not found",
      } as ApiResponse<User | null>;
    }

    return {
      data: user,
      error: false,
      message: "User fetched successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<User>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Error fetching user",
      statusCode: 500,
      success: false,
    } as ApiResponse<User | null>;
  }
};
