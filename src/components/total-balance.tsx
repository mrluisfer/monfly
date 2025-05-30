import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useRouteUser } from "~/hooks/use-route-user";
import { userByEmailQueryOptions } from "~/queries/usersByEmail";
import { formatCurrency } from "~/utils/formatCurrency";
import Card from "./card";
import { Skeleton } from "./ui/skeleton";

const TotalBalance = () => {
	const user = useRouteUser();

	if (!user.email) {
		return <div>No user email</div>;
	}

	const { isPending, data, error } = useQuery(
		userByEmailQueryOptions(user.email),
	);

	return (
		<Card>
			{isPending ? (
				<Skeleton className="w-24 h-4" />
			) : (
				<>
					<div className="flex items-center justify-between">
						Current Balance <DollarSign className="w-4 h-4 opacity-50" />
					</div>
					<p className="text-2xl font-bold">
						{formatCurrency(data?.totalBalance ?? 0, "MXN")}
					</p>
				</>
			)}
		</Card>
	);
};

export default TotalBalance;
