import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";

export const getTransactionById = async (data: { id: string }) => {
	try {
		if (!data.id) {
			return {
				error: true,
				message: "Transaction ID is required",
				data: null,
				success: false,
				statusCode: 400,
			} as ApiResponse<Transaction | null>;
		}

		const transaction = await prismaClient.transaction.findUnique({
			where: { id: data.id },
		});

		if (!transaction) {
			return {
				error: true,
				message: "Transaction not found",
				data: null,
				success: false,
				statusCode: 404,
			} as ApiResponse<Transaction | null>;
		}

		return {
			status: 200,
			transaction,
			data: transaction,
			error: false,
			success: true,
			message: "Transaction fetched successfully",
		} as ApiResponse<Transaction>;
	} catch (error) {
		return {
			error: true,
			message: "Error fetching transaction",
			data: null,
			success: false,
			statusCode: 500,
		} as ApiResponse<Transaction | null>;
	}
};
