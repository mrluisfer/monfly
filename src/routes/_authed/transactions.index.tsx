import { createFileRoute } from "@tanstack/react-router";
import Transactions from "~/components/transactions";
import Title from "~/components/ui/title";

export const Route = createFileRoute("/_authed/transactions/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Title>Transactions</Title>
			<div className="grid grid-cols-5 gap-4">
				<div className="col-span-3">
					<div>View all transactions</div>
				</div>
				<div className="col-span-2">
					<Transactions />
				</div>
			</div>
		</div>
	);
}
