import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { prismaClient } from "~/utils/prisma";

export const APIRoute = createAPIFileRoute("/api/transaction")({
	GET: async ({ request, params }) => {
		const transactions = await prismaClient.transaction.findMany();
		return json({ transactions });
	},
});
