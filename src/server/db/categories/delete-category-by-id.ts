import type { Category } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteCategoryById = async (id: string) => {
  try {
    const deletedCategory = await prismaClient.category.delete({
      where: {
        id,
      },
    });

    return {
      data: deletedCategory,
      error: false,
      message: "Category deleted successfully",
      status: "success",
      statusCode: 200,
      success: true,
    } as ApiResponse<Category>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Failed to delete category",
      status: "error",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
