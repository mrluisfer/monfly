import { prismaClient } from "../prisma";

export const getTotalExpensesByEmail = async ({ email }: { email: string }) => {
  const totalExpenses = await prismaClient.transaction.aggregate({
    where: { userEmail: email, type: "expense" },
    _sum: { amount: true },
  });
  return totalExpenses._sum.amount ?? 0;
};
