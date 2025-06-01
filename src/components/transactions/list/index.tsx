import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import type { TTransaction } from "~/lib/api/transactionByEmail";
import { transactionByEmailQueryOptions } from "~/queries/transactionByEmail";
import Card from "../../card";
import TransactionItem from "./transaction-item";

const TransactionsList = () => {
	const user = useRouteUser();

	const { data, error, isPending } = useQuery(
		transactionByEmailQueryOptions(user.email),
	);

	return (
		<Card
			title="Transactions"
			subtitle={`You made ${data?.length} transactions`}
		>
			{isPending && <div>Loading...</div>}
			{error && <div>Error: {error.message}</div>}
			{data && (
				<div className="flex flex-col gap-6">
					{data.map((transaction: TTransaction) => (
						<div key={transaction.id}>
							<TransactionItem transaction={transaction} key={transaction.id} />
						</div>
					))}
				</div>
			)}
		</Card>
	);
};

export default TransactionsList;
