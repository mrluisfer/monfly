import type { Category } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";

export const getCategoryByEmail = async (
  email: string,
): Promise<ApiResponse<Category[]> | ApiResponse<null>> => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      success: false,
      message: "Email is required",
      data: null,
      error: true,
      statusCode: 400,
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
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      error: false,
      statusCode: 200,
    };
  } catch (error) {
    console.error("[getCategoryByEmail] failed", error);
    return {
      success: false,
      message: "Failed to get categories",
      data: null,
      error: true,
      statusCode: 500,
    };
  }
};
