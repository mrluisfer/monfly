import { createServerFn } from "@tanstack/react-start";
import { prismaClient } from "../prisma";

export const getTransactionById = createServerFn({ method: "GET" })
	.validator((d: { id: string }) => d)
	.handler(async ({ data }) => {
		try {
			if (!data.id) {
				return {
					error: true,
					message: "Transaction ID is required",
				};
			}

			const transaction = await prismaClient.transaction.findUnique({
				where: { id: data.id },
			});

			if (!transaction) {
				return {
					error: true,
					message: "Transaction not found",
				};
			}

			return {
				status: 200,
				transaction,
			};
		} catch (error) {
			return {
				error: true,
				message: "Error fetching transaction",
			};
		}
	});
