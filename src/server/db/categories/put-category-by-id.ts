import type { Category } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const putCategoryById = async (data: {
  categoryId: string;
  name: string;
  icon: string;
}) => {
  try {
    if (!(data.name && data.icon)) {
      return {
        data: null,
        error: true,
        message: "Name and icon are required",
        statusCode: 400,
        success: false,
      } as ApiResponse<null>;
    }

    const currentDate = new Date();

    const categoryUpdated = await prismaClient.category.update({
      data: {
        icon: data.icon,
        name: data.name,
        updatedAt: currentDate,
      },
      where: { id: data.categoryId },
    });

    return {
      data: categoryUpdated,
      error: false,
      message: "Category updated successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<Category>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Error updating category",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
