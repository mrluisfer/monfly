import { Category } from "@prisma/client";
import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const deleteCategoryById = async (id: string) => {
  try {
    const deletedCategory = await prismaClient.category.delete({
      where: {
        id,
      },
    });

    return {
      data: deletedCategory,
      message: "Category deleted successfully",
      status: "success",
      success: true,
      error: false,
      statusCode: 200,
    } as ApiResponse<Category>;
  } catch (error) {
    return {
      data: null,
      message: "Failed to delete category",
      status: "error",
      success: false,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
