import type { User } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const putUserTotalBalance = async (data: {
  totalBalance: number;
  email: string;
}) => {
  try {
    await prismaClient.user.update({
      data: { totalBalance: data.totalBalance },
      where: { email: data.email },
    });

    return {
      data: null,
      error: false,
      message: "User total balance updated",
      statusCode: 200,
      success: true,
    } as ApiResponse<User | null>;
  } catch {
    return {
      data: null,
      error: true,
      message: "User not found or error updating user total balance",
      statusCode: 500,
      success: false,
    } as ApiResponse<User | null>;
  }
};
