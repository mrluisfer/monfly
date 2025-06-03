import type { Category } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";

export const getCategoryByEmail = async (email: string) => {
  try {
    const categories = await prismaClient.category.findMany({
      where: {
        userEmail: email,
      },
    });

    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      error: false,
      statusCode: 200,
    } as ApiResponse<Category[]>;
  } catch (error) {
    return {
      success: false,
      message: "Failed to get categories",
      data: null,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
