import type { Prisma } from "@prisma/client";
import { prismaClient as prisma } from "./prisma";

export const createTransaction = async (data: {
  userEmail: string;
  amount: number;
  type: string;
  category: string;
  description?: string;
  date: Date;
}) => {
  return prisma.transaction.create({ data });
};

export const getTransactionsByUser = async (userEmail: string) => {
  return prisma.transaction.findMany({ where: { userEmail } });
};

export const updateTransaction = async (
  id: string,
  data: Partial<Omit<Prisma.TransactionUpdateInput, "userEmail">>,
) => {
  return prisma.transaction.update({
    where: { id },
    data,
  });
};

export const deleteTransaction = async (id: string) => {
  return prisma.transaction.delete({ where: { id } });
};
