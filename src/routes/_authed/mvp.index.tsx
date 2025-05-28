import { Link, createFileRoute } from "@tanstack/react-router";
import Transactions from "~/components/transactions";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_authed/mvp/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Button asChild>
				<Link to="/home">Home</Link>
			</Button>
			<h2>MVP</h2>
			<Transactions />
		</div>
	);
}
