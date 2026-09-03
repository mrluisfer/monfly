import type { Category } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const getCategoryByEmail = async (
  email: string,
): Promise<ApiResponse<Category[]> | ApiResponse<null>> => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      data: null,
      error: true,
      message: "Email is required",
      statusCode: 400,
      success: false,
    };
  }

  try {
    const categories = await prismaClient.category.findMany({
      where: { userEmail: normalizedEmail },
    });

    categories.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );

    return {
      data: categories,
      error: false,
      message: "Categories fetched successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    console.error("[getCategoryByEmail] failed", error);
    return {
      data: null,
      error: true,
      message: "Failed to get categories",
      statusCode: 500,
      success: false,
    };
  }
};
