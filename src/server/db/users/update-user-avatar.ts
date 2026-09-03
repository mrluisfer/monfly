import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const updateUserAvatar = async (data: {
  email: string;
  avatarSeed: string | null;
}): Promise<ApiResponse<null>> => {
  try {
    await prismaClient.user.update({
      data: { avatarSeed: data.avatarSeed },
      where: { email: data.email },
    });

    return {
      data: null,
      error: false,
      message: "Avatar updated",
      statusCode: 200,
      success: true,
    };
  } catch {
    return {
      data: null,
      error: true,
      message: "Error updating avatar",
      statusCode: 500,
      success: false,
    };
  }
};
