import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import Card from "~/components/card";
import Layout from "~/components/layout";
import { overviewSections } from "~/components/sidebar/overview-section";
import Title from "~/components/ui/title";
import { usersQueryOptions } from "~/queries/fetchUsers";

export const Route = createFileRoute("/_authed/home/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isPending, data, error } = useQuery(usersQueryOptions);

	console.log("isPending", isPending);
	console.log("data", data);
	console.log("error", error);
	return (
		<ClientOnly>
			<Layout>
				<Title className="pb-12">Overview</Title>
				<div
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
				</div>
			</Layout>
		</ClientOnly>
	);
}
