import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";
import { getUserByEmail } from "../user/get-user-by-email";

export const postTransactionByEmail = async (
	email: string,
	data: Transaction,
) => {
	try {
		const user = await getUserByEmail(email);
		if (!user || !user.data?.email) {
			return {
				error: true,
				message: "User not found",
				data: null,
				success: false,
				statusCode: 404,
			} as ApiResponse<string | null>;
		}

		const transaction = await prismaClient.transaction.create({
			data: {
				...data,
				userEmail: user.data?.email,
			},
		});

		return {
			error: false,
			message: "Transaction created successfully",
			data: transaction,
			success: true,
			statusCode: 200,
		} as ApiResponse<Transaction>;
	} catch (error) {
		return {
			error: true,
			message: "Error creating transaction",
			data: null,
			success: false,
			statusCode: 500,
		} as ApiResponse<string | null>;
	}
};
