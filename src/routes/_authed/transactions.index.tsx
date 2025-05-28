import type { Transaction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import Card from "~/components/card";
import Transactions from "~/components/transactions";
import Title from "~/components/ui/title";
import { transactionByEmailQueryOptions } from "~/queries/transactionByEmail";
import { Route as AuthedRoute } from "~/routes/_authed";

export const Route = createFileRoute("/_authed/transactions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const authedRouteContext: { user: { email: string } } = useRouteContext({
		from: "/_authed",
	});

	if (!authedRouteContext.user.email) {
		return <div>No user email</div>;
	}

	const { data, error, isPending } = useQuery(
		transactionByEmailQueryOptions(authedRouteContext.user.email),
	);

	console.log(data);
	return (
		<div>
			<Title>Transactions</Title>
			<div className="grid grid-cols-5 gap-4">
				<div className="col-span-3">
					<div>
						<Card title="Transactions">
							{isPending && <div>Loading...</div>}
							{error && <div>Error: {error.message}</div>}
							{data && (
								<div>
									{data.map((transaction: Transaction) => (
										<div key={transaction.id}>
											{transaction.id}
											{transaction.amount}
											{transaction.type}
										</div>
									))}
								</div>
							)}
						</Card>
					</div>
				</div>
				<div className="col-span-2">
					<Transactions />
				</div>
			</div>
		</div>
	);
}
