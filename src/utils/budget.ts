import { prismaClient as prisma } from "./prisma";

export const createBudget = async (data: {
	userEmail: string;
	category: string;
	amountLimit: number;
	startDate: Date;
	endDate: Date;
}) => {
	return prisma.budget.create({ data });
};

export const getBudgetsByUser = async (userEmail: string) => {
	return prisma.budget.findMany({ where: { userEmail } });
};
