import type { Category } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";

export const postCategoryByEmail = async (
  category: { name: string; icon: string },
  userEmail: string,
) => {
  try {
    const currentDate = new Date();

    const categoryCreated = await prismaClient.category.create({
      data: {
        name: category.name,
        icon: category.icon,
        userEmail,
        createdAt: currentDate,
      },
    });

    return {
      success: true,
      message: "Category created successfully",
      data: categoryCreated,
      error: false,
      statusCode: 200,
    } as ApiResponse<Category>;
  } catch (error) {
    return {
      success: false,
      message: "Error posting category",
      data: null,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
