import { useRouteContext } from "@tanstack/react-router";

export const useRouteUser = () => {
	const authedRouteContext: { user: { email: string } } = useRouteContext({
		from: "/_authed",
	});

	if (!authedRouteContext) {
		throw new Error("Auth Route context not found");
	}

	return authedRouteContext.user;
};
