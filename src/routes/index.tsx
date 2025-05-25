import {
	createFileRoute,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	// example of using route context:
	// const routeContext = useRouteContext({
	//   from: "__root__",
	// });

	// this should be a landing page
	return null;
}
