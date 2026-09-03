import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteCategoriesById = async (
  ids: string[],
): Promise<ApiResponse<{ count: number }>> => {
  try {
    const deletedCategories = await prismaClient.category.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return {
      data: { count: deletedCategories.count },
      error: false,
      message: "Categories deleted successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    return {
      data: { count: 0 },
      error: true,
      message:
        error instanceof Error ? error.message : "Error deleting categories",
      statusCode: 500,
      success: false,
    } as ApiResponse<{ count: number }>;
  }
};
