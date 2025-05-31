import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import IncomeChart from "~/components/income-chart";
import TotalBalance from "~/components/total-balance";
import TransactionsList from "~/components/transactions-list";
import { Button } from "~/components/ui/button";
import { useRouteUser } from "~/hooks/use-route-user";
import { useUser } from "~/hooks/use-user";

export const Route = createFileRoute("/_authed/home/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { email } = useRouteUser();
	const { data: user, isPending, error } = useUser(email);

	return (
		<main>
			<header className="mb-6 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-medium">
						Welcome back
						{!isPending && <span className="capitalize">, {user?.name}</span>}
					</h1>
					<span className="opacity-50">This is your overview dashboard</span>
				</div>
				<div>
					<Button>
						<Plus />
						Income
					</Button>
				</div>
			</header>
			<section className="flex flex-col gap-4">
				<div className="grid grid-cols-3 gap-6 w-full">
					<TotalBalance />
					<IncomeChart />
				</div>
				<div className="grid grid-cols-6 gap-6 w-full">
					<div className="col-span-3">
						<TransactionsList />
					</div>
				</div>
			</section>
		</main>
	);
}
