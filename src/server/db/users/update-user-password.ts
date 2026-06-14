import type { ApiResponse } from "~/types/ApiResponse";

import { hashPassword, prismaClient, verifyPassword } from "~/server/prisma";

export const updateUserPassword = async (data: {
  email: string;
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
      select: { id: true, password: true },
    });

    if (!user) {
      return {
        error: true,
        message: "User not found",
        data: null,
        success: false,
        statusCode: 404,
      } as ApiResponse<null>;
    }

    const isCurrentPasswordValid = await verifyPassword(
      data.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return {
        error: true,
        message: "Your current password is incorrect",
        data: null,
        success: false,
        statusCode: 401,
      } as ApiResponse<null>;
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prismaClient.user.update({
      where: { email: data.email },
      data: { password: hashedPassword },
    });

    return {
      error: false,
      message: "Password updated successfully",
      data: null,
      success: true,
      statusCode: 200,
    } as ApiResponse<null>;
  } catch {
    return {
      error: true,
      message: "Error updating password",
      data: null,
      success: false,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
