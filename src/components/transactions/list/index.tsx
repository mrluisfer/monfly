import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email.server";
import type { TransactionWithUser } from "~/types/TransactionWithUser";
import Card from "../../card";
import TransactionItem from "./transaction-item";

const TransactionsList = () => {
	const userEmail = useRouteUser();

	const { data, isPending, error } = useQuery({
		queryKey: ["transactions", userEmail],
		queryFn: () => getTransactionByEmailServer({ data: { email: userEmail } }),
		enabled: !!userEmail,
	});

	return (
		<Card
			title="Transactions"
			subtitle={`You made ${data?.data?.length} transactions`}
		>
			{isPending && <div>Loading...</div>}
			{error && <div>Error: {error?.message}</div>}
			{data?.data && (
				<div className="flex flex-col gap-6">
					{data?.data?.map((transaction) => (
						<div key={transaction.id}>
							<TransactionItem
								transaction={transaction as TransactionWithUser}
								key={transaction.id}
							/>
						</div>
					))}
				</div>
			)}
		</Card>
	);
};

export default TransactionsList;
