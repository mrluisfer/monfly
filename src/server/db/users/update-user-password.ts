import { hashPassword, prismaClient, verifyPassword } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const updateUserPassword = async (data: {
  email: string;
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const user = await prismaClient.user.findUnique({
      select: { id: true, password: true },
      where: { email: data.email },
    });

    if (!user) {
      return {
        data: null,
        error: true,
        message: "User not found",
        statusCode: 404,
        success: false,
      } as ApiResponse<null>;
    }

    const isCurrentPasswordValid = await verifyPassword(
      data.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return {
        data: null,
        error: true,
        message: "Your current password is incorrect",
        statusCode: 401,
        success: false,
      } as ApiResponse<null>;
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prismaClient.user.update({
      data: { password: hashedPassword },
      where: { email: data.email },
    });

    return {
      data: null,
      error: false,
      message: "Password updated successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<null>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Error updating password",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
