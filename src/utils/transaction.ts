import type { Prisma } from "@prisma/client";
import { prismaClient as prisma } from "~/server/prisma";

export const createTransaction = async (data: {
  userEmail: string;
  amount: number;
  type: string;
  category: string;
  description?: string;
  date: Date;
}) => prisma.transaction.create({ data });

export const getTransactionsByUser = async (userEmail: string) =>
  prisma.transaction.findMany({ where: { userEmail } });

export const updateTransaction = async (
  id: string,
  data: Partial<Omit<Prisma.TransactionUpdateInput, "userEmail">>,
) =>
  prisma.transaction.update({
    data,
    where: { id },
  });

export const deleteTransaction = async (id: string) =>
  prisma.transaction.delete({ where: { id } });
