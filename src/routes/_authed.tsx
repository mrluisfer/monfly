import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchUser } from "~/utils/auth/fetch-user";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async () => {
		const user = await fetchUser();
		if (!user) {
			// This means the user is not authenticated
			return redirect({
				to: "/login",
			});
		}
	},
	errorComponent: ({ error }) => {
		if (error.message === "Not authenticated") {
			// return <Login />;
			return <div>Not authenticated</div>;
		}
		throw error;
	},
});
