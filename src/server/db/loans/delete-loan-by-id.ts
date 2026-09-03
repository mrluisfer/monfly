import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteLoanById = async (
  email: string,
  id: string,
): Promise<ApiResponse<{ id: string } | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const existing = await prismaClient.loan.findFirst({
      select: { id: true },
      where: { id, userEmail: email },
    });

    if (!existing) {
      return {
        data: null,
        error: true,
        message: "Loan not found",
        statusCode: 404,
        success: false,
      };
    }

    // Block deletion if any transaction is paying this loan. The relation is
    // optional, so Prisma defaults to onDelete: SetNull — deleting here would
    // silently unlink those payments (appliedToLoanId -> null) and corrupt the
    // loan/transaction coupling. Surface a 409 instead.
    const linkedPayments = await prismaClient.transaction.count({
      where: { appliedToLoanId: id, userEmail: email },
    });
    if (linkedPayments > 0) {
      return {
        data: null,
        error: true,
        message: "Cannot delete loan with linked payment transactions",
        statusCode: 409,
        success: false,
      };
    }

    await prismaClient.loan.delete({ where: { id } });

    return {
      data: { id },
      error: false,
      message: "Loan deleted successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error deleting loan: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
