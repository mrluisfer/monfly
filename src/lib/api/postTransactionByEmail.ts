import type { Prisma } from "@prisma/client";

export const postTransactionByEmail = async (
	email: string,
	data: Prisma.TransactionCreateInput,
) => {
	try {
		const response = await fetch("/api/transaction", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, ...data }),
		});

		if (!response.ok) {
			throw new Error("Failed to create transaction");
		}

		return response.json();
	} catch (error) {
		console.error("Error creating transaction:", error);
		throw error;
	}
};
