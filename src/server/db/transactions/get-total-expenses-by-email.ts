import { withDatabaseTimeout } from "~/utils/timeout";

import { prismaClient } from "~/server/prisma";

export const getTotalExpensesByEmail = async ({
  email,
  cardId,
}: {
  email: string;
  cardId?: string | null;
}) => {
  const totalExpenses = await withDatabaseTimeout(() =>
    prismaClient.transaction.aggregate({
      where: {
        userEmail: email,
        type: "expense",
        ...(cardId ? { cardId } : {}),
      },
      _sum: { amount: true },
    }),
  );
  return totalExpenses._sum.amount ?? 0;
};
