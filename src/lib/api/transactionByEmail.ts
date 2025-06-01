import type { Prisma, Transaction, User } from "@prisma/client";
import type { QueryFunctionContext } from "@tanstack/react-query";

export const postTransactionByEmail = async (
	email: string,
	data: Prisma.TransactionCreateInput,
) => {
	try {
		const response = await fetch(`/api/transactions/${email}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, ...data }),
		});

		if (!response.ok) {
			throw new Error("Failed to create transaction");
		}

		return { success: true };
	} catch (error) {
		console.error("Error creating transaction:", error);
		throw error;
	}
};

export type TTransaction = Transaction & {
	user: User;
};

export const getTransactionByEmail = async ({
	queryKey,
}: QueryFunctionContext<["transactionByEmail", string]>) => {
	try {
		const [_, email] = queryKey;
		const response = await fetch(`/api/transactions/${email}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch transactions");
		}

		const responseData = await response.json();
		if (responseData.error) {
			throw new Error(responseData.error);
		}

		return responseData.transactions as TTransaction[];
	} catch (error) {
		console.error("Error fetching transactions:", error);
		throw error;
	}
};
