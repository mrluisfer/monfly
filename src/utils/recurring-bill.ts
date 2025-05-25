import { prismaClient as prisma } from "./prisma";

export const createRecurringBill = async (data: {
	userEmail: string;
	title: string;
	amount: number;
	frequency: string;
	nextDueDate: Date;
	category: string;
}) => {
	return prisma.recurringBill.create({ data });
};

export const getRecurringBillsByUser = async (userEmail: string) => {
	return prisma.recurringBill.findMany({ where: { userEmail } });
};
