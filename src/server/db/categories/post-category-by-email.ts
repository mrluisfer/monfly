import type { Category } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const postCategoryByEmail = async (
  category: { name: string; icon: string },
  userEmail: string,
) => {
  try {
    const currentDate = new Date();

    const categoryCreated = await prismaClient.category.create({
      data: {
        createdAt: currentDate,
        icon: category.icon,
        name: category.name,
        userEmail,
      },
    });

    return {
      data: categoryCreated,
      error: false,
      message: "Category created successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<Category>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Error posting category",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
