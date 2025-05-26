import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import Card from "~/components/card";
import Layout from "~/components/layout";
import { overviewSections } from "~/components/sidebar/overview-section";
import Title from "~/components/ui/title";

export const Route = createFileRoute("/_authed/home/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { isPending, data, error } = useQuery(usersQueryOptions);

	return (
		<ClientOnly>
			<Layout>
				<Title className="pb-12">Overview</Title>
				{/* <div
					className="grid grid-cols-3 gap-6 w-full"
					id={overviewSections.balance}
				>
					<Card variant="secondary">
						<p>Current Balance</p>
						<p className="text-2xl font-bold">$1,000.00</p>
					</Card>
					<Card>
						<p>Current Balance</p>
						<p className="text-2xl font-bold">$1,000.00</p>
					</Card>
					<Card>
						<p>Current Balance</p>
						<p className="text-2xl font-bold">$1,000.00</p>
					</Card>
				</div> */}
				<div>
					<h2>Balance</h2>
				</div>
			</Layout>
		</ClientOnly>
	);
}
