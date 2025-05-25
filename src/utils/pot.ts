import { prismaClient as prisma } from "./prisma";

export const createPot = async (data: {
	userEmail: string;
	title: string;
	goalAmount: number;
	category?: string;
}) => {
	return prisma.pot.create({ data });
};

export const getPotsByUser = async (userEmail: string) => {
	return prisma.pot.findMany({ where: { userEmail } });
};
