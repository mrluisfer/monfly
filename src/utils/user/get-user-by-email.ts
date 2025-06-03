import type { User } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        error: true,
        message: "User not found",
        data: null,
      } as ApiResponse<User | null>;
    }

    return {
      error: false,
      message: "User fetched successfully",
      data: user,
      success: true,
      statusCode: 200,
    } as ApiResponse<User>;
  } catch (error) {
    return {
      error: true,
      message: "Error fetching user",
      data: null,
      success: false,
      statusCode: 500,
    } as ApiResponse<User | null>;
  }
};
