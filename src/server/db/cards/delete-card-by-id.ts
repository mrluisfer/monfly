import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteCardById = async (
  email: string,
  id: string,
): Promise<ApiResponse<{ id: string } | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const result = await prismaClient.$transaction(async (tx) => {
      const existing = await tx.card.findFirst({
        select: { balance: true, id: true },
        where: { id, userEmail: email },
      });

      if (!existing) {
        return { notFound: true as const };
      }

      // The FK is ON DELETE SET NULL, so this card's transactions become
      // card-less (cardId = null) and keep counting in the user total. To keep
      // totalBalance == sum(card balances) + sum(card-less impacts), we only
      // need to remove the portion of this card's balance that is NOT backed by
      // its transactions — i.e. an opening balance set manually. The
      // transaction-driven portion simply moves to the card-less bucket.
      const [incomeAgg, expenseAgg] = await Promise.all([
        tx.transaction.aggregate({
          _sum: { amount: true },
          where: { cardId: id, type: "income", userEmail: email },
        }),
        tx.transaction.aggregate({
          _sum: { amount: true },
          where: { cardId: id, type: "expense", userEmail: email },
        }),
      ]);

      const transactionImpact =
        (incomeAgg._sum.amount ?? 0) - (expenseAgg._sum.amount ?? 0);
      const openingPortion = (existing.balance ?? 0) - transactionImpact;

      if (openingPortion !== 0) {
        await tx.user.update({
          data: { totalBalance: { increment: -openingPortion } },
          where: { email },
        });
      }

      // Transactions are orphaned automatically by the SET NULL FK.
      await tx.card.delete({ where: { id } });

      return { notFound: false as const };
    });

    if (result.notFound) {
      return {
        data: null,
        error: true,
        message: "Card not found",
        statusCode: 404,
        success: false,
      };
    }

    return {
      data: { id },
      error: false,
      message: "Card deleted successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error deleting card: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
