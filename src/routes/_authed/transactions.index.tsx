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
    <div>
      <header className="mb-6 flex justify-between items-center">
        <PageTitle description="Manage your transactions here">
          Transactions
        </PageTitle>
      </header>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <AddTransaction />
        </div>
        <div className="col-span-3">
          <TransactionsList />
        </div>
      </div>
    </div>
  );
}
