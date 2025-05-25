import type { User } from "@prisma/client";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { prismaClient } from "~/utils/prisma";

export const APIRoute = createAPIFileRoute("/api/users")({
	GET: async ({ request, params }) => {
		try {
			const users: User[] = await prismaClient.user.findMany();
			return json(users);
		} catch (error) {
			console.error("Error fetching users:", error);
			return json({ error: "Failed to fetch users" }, { status: 500 });
		}
	},
});
