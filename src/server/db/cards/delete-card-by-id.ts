import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteCardById = async (
  email: string,
  id: string,
): Promise<ApiResponse<{ id: string } | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const result = await prismaClient.$transaction(async (tx) => {
      const existing = await tx.card.findFirst({
        where: { id, userEmail: email },
        select: { id: true, balance: true },
      });

      if (!existing) return { notFound: true as const };

      // The FK is ON DELETE SET NULL, so this card's transactions become
      // card-less (cardId = null) and keep counting in the user total. To keep
      // totalBalance == sum(card balances) + sum(card-less impacts), we only
      // need to remove the portion of this card's balance that is NOT backed by
      // its transactions — i.e. an opening balance set manually. The
      // transaction-driven portion simply moves to the card-less bucket.
      const [incomeAgg, expenseAgg] = await Promise.all([
        tx.transaction.aggregate({
          where: { cardId: id, userEmail: email, type: "income" },
          _sum: { amount: true },
        }),
        tx.transaction.aggregate({
          where: { cardId: id, userEmail: email, type: "expense" },
          _sum: { amount: true },
        }),
      ]);

      const transactionImpact =
        (incomeAgg._sum.amount ?? 0) - (expenseAgg._sum.amount ?? 0);
      const openingPortion = (existing.balance ?? 0) - transactionImpact;

      if (openingPortion !== 0) {
        await tx.user.update({
          where: { email },
          data: { totalBalance: { increment: -openingPortion } },
        });
      }

      // Transactions are orphaned automatically by the SET NULL FK.
      await tx.card.delete({ where: { id } });

      return { notFound: false as const };
    });

    if (result.notFound) {
      return {
        error: true,
        message: "Card not found",
        data: null,
        success: false,
        statusCode: 404,
      };
    }

    return {
      error: false,
      message: "Card deleted successfully",
      data: { id },
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error deleting card: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
