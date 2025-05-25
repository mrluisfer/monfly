import { createFileRoute } from "@tanstack/react-router";
import { logoutFn } from "~/utils/auth/logoutfn";

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: () =>
		logoutFn({
			data: {
				destination: "/",
				manualRedirect: false,
			},
		}),
});
