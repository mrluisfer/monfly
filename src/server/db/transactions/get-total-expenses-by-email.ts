import { prismaClient } from "~/server/prisma";
import { withDatabaseTimeout } from "~/utils/timeout";

export const getTotalExpensesByEmail = async ({
  email,
  cardId,
}: {
  email: string;
  cardId?: string | null;
}) => {
  const totalExpenses = await withDatabaseTimeout(() =>
    prismaClient.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: "expense",
        userEmail: email,
        ...(cardId ? { cardId } : {}),
      },
    }),
  );
  return totalExpenses._sum.amount ?? 0;
};
