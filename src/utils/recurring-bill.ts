import { prismaClient as prisma } from "~/server/prisma";

export const createRecurringBill = async (data: {
  userEmail: string;
  title: string;
  amount: number;
  frequency: string;
  nextDueDate: Date;
  category: string;
}) => prisma.recurringBill.create({ data });

export const getRecurringBillsByUser = async (userEmail: string) =>
  prisma.recurringBill.findMany({ where: { userEmail } });
