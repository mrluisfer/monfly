import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";

export const getTransactionByEmail = async (email: string) => {
	try {
		const transactions = await prismaClient.transaction.findMany({
			where: { userEmail: email },
			include: {
				user: true,
			},
		});

		return {
			error: false,
			message: "Transactions fetched successfully",
			data: transactions,
			success: true,
			statusCode: 200,
		} as ApiResponse<Transaction[]>;
	} catch (error) {
		return {
			error: true,
			message: "Error fetching transactions",
			data: null,
			statusCode: 500,
		} as ApiResponse<Transaction[] | null>;
	}
};
