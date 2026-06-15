import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";

export const updateUserAvatar = async (data: {
  email: string;
  avatarSeed: string | null;
}): Promise<ApiResponse<null>> => {
  try {
    await prismaClient.user.update({
      where: { email: data.email },
      data: { avatarSeed: data.avatarSeed },
    });

    return {
      error: false,
      message: "Avatar updated",
      data: null,
      success: true,
      statusCode: 200,
    };
  } catch {
    return {
      error: true,
      message: "Error updating avatar",
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
