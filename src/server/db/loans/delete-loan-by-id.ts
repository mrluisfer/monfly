import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteLoanById = async (
  email: string,
  id: string
): Promise<ApiResponse<{ id: string } | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const existing = await prismaClient.loan.findFirst({
      where: { id, userEmail: email },
      select: { id: true },
    });

    if (!existing) {
      return {
        error: true,
        message: "Loan not found",
        data: null,
        success: false,
        statusCode: 404,
      };
    }

    await prismaClient.loan.delete({ where: { id } });

    return {
      error: false,
      message: "Loan deleted successfully",
      data: { id },
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error deleting loan: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
