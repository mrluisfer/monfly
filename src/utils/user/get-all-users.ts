import type { User } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const getAllUsers = async () => {
  try {
    const users = await prismaClient.user.findMany();
    return {
      success: true,
      message: "Users fetched successfully",
      data: users,
      error: false,
      statusCode: 200,
    } as ApiResponse<User[]>;
  } catch (error) {
    return {
      error: true,
      message: "Error fetching users",
      data: [],
      success: false,
      statusCode: 500,
    } as ApiResponse<User[]>;
  }
};
