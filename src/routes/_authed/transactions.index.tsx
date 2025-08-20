import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "~/components/page-title";
import AddTransaction from "~/components/transactions/add-transaction";
import TransactionsList from "~/components/transactions/list";
import { useRouteUser } from "~/hooks/use-route-user";

export const Route = createFileRoute("/_authed/transactions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userEmail = useRouteUser();

  if (!userEmail) {
    return <div>No user email</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle description="Manage your transactions here">
          Transactions
        </PageTitle>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="order-2 md:order-1 lg:col-span-2">
          <AddTransaction />
        </div>
        <div className="order-1 md:order-2 md:col-span-2 lg:col-span-3">
          <TransactionsList />
        </div>
      </div>
    </div>
  );
}
