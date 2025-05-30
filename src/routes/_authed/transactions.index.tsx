import { createFileRoute } from "@tanstack/react-router";
import TransactionsForm from "~/components/transactions-form";
import TransactionsList from "~/components/transactions-list";
import { useRouteUser } from "~/hooks/use-route-user";

export const Route = createFileRoute("/_authed/transactions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const user = useRouteUser();

	if (!user.email) {
		return <div>No user email</div>;
	}

	return (
		<div>
			<h1 className="text-2xl font-bold">Transactions</h1>
			<div className="grid grid-cols-5 gap-4">
				<div className="col-span-3">
					<TransactionsList />
				</div>
				<div className="col-span-2">
					<TransactionsForm />
				</div>
			</div>
		</div>
	);
}
