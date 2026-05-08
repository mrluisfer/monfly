import { createFileRoute } from "@tanstack/react-router";
import { AddTransactionDrawer } from "~/components/transactions/AddTransactionDrawer";
import TransactionsList from "~/components/transactions/list";
import { useRouteUser } from "~/hooks/useRouteUser";

export const Route = createFileRoute("/_authed/home/transactions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userEmail = useRouteUser();

  if (!userEmail) {
    return (
      <div className="text-muted-foreground py-10 text-center text-sm">
        No user session found.
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <TransactionsList />
      <AddTransactionDrawer />
    </div>
  );
}
