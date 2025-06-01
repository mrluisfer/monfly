import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prismaClient } from "../prisma";

export const putTransactionById = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string(),
			data: z.object({
				amount: z.number(),
				type: z.string(),
				category: z.string(),
				description: z.string(),
				date: z.date(),
			}),
		}),
	)
	.handler(async ({ data }) => {
		try {
			const { id, data: transactionData } = data;
			await prismaClient.transaction.update({
				where: { id },
				data: transactionData,
			});

			return {
				success: true,
				message: "Transaction updated successfully",
			};
		} catch (error) {
			return {
				error: true,
				message: "Transaction not found or error updating transaction",
			};
		}
	});
