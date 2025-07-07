import { Category } from "@prisma/client";
import { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/utils/prisma";

export const putCategoryById = async (data: {
  categoryId: string;
  name: string;
  icon: string;
}) => {
  try {
    if (!data.name || !data.icon) {
      return {
        success: false,
        message: "Name and icon are required",
        data: null,
        error: true,
        statusCode: 400,
      } as ApiResponse<null>;
    }

    const currentDate = new Date();

    const categoryUpdated = await prismaClient.category.update({
      where: { id: data.categoryId },
      data: {
        name: data.name,
        icon: data.icon,
        updatedAt: currentDate,
      },
    });

    return {
      success: true,
      message: "Category updated successfully",
      data: categoryUpdated,
      error: false,
      statusCode: 200,
    } as ApiResponse<Category>;
  } catch (error) {
    return {
      success: false,
      message: "Error updating category",
      data: null,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
