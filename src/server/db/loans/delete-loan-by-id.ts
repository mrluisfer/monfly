import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteLoanById = async (
  email: string,
  id: string,
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

    // Block deletion if any transaction is paying this loan. The relation is
    // optional, so Prisma defaults to onDelete: SetNull — deleting here would
    // silently unlink those payments (appliedToLoanId -> null) and corrupt the
    // loan/transaction coupling. Surface a 409 instead.
    const linkedPayments = await prismaClient.transaction.count({
      where: { appliedToLoanId: id, userEmail: email },
    });
    if (linkedPayments > 0) {
      return {
        error: true,
        message: "Cannot delete loan with linked payment transactions",
        data: null,
        success: false,
        statusCode: 409,
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
