import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";

export const deleteCategoriesById = async (
  ids: string[]
): Promise<ApiResponse<{ count: number }>> => {
  try {
    const deletedCategories = await prismaClient.category.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return {
      error: false,
      message: "Categories deleted successfully",
      data: { count: deletedCategories.count },
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Error deleting categories",
      data: { count: 0 },
      success: false,
      statusCode: 500,
    } as ApiResponse<{ count: number }>;
  }
};
