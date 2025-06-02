import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import Layout from "~/components/layout";
import { getUserSession } from "~/utils/user/get-user-session";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async () => {
		const { data: userEmail } = await getUserSession();
		if (!userEmail) {
			// This means the user is not authenticated
			return redirect({
				to: "/login",
			});
		}

		return { user: userEmail };
	},
	errorComponent: ({ error }) => {
		if (error.message === "Not authenticated") {
			// return <Login />;
			return <div>Not authenticated</div>;
		}
		throw error;
	},
	component: () => {
		return (
			<Layout>
				<Outlet />
			</Layout>
		);
	},
});
