import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { prismaClient } from "~/utils/prisma";

export const APIRoute = createAPIFileRoute("/api/user/$email")({
	GET: async ({ request, params }) => {
		try {
			const { email } = params;
			if (!email) {
				return json({ error: "Email is required" }, { status: 400 });
			}

			const user = await prismaClient.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				return json({ error: "User not found" }, { status: 404 });
			}

			return json(user);
		} catch (error) {
			console.error("Error fetching user:", error);
			return json({ error: "Failed to fetch user" }, { status: 500 });
		}
	},
});
