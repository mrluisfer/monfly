import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { prismaClient } from "~/utils/prisma";

export const APIRoute = createAPIFileRoute("/api/transaction")({
	GET: ({ request, params }) => {
		return json({ message: 'Hello "/api/transactions"!' });
	},
	POST: async ({ request, params }) => {
		try {
			const data = await request.json();

			await prismaClient.transaction.create({
				data: {
					amount: Number.parseFloat(data.amount),
					type: data.type,
					category: data.category,
					description: data.description || "",
					date: data.date || new Date(),
					userEmail: data.email,
				},
			});

			return json({ message: "Transaction created" }, { status: 201 });
		} catch (error) {
			console.error("Error creating transaction:", error);
			return json(
				{ error: "Failed to create transaction", message: error },
				{ status: 500 },
			);
		}
	},
});
