import { createFileRoute } from "@tanstack/react-router";
import { CreditCardIcon } from "lucide-react";
import { PageHeader } from "~/components/layout/PageHeader";
import { AddTransactionDrawer } from "~/components/transactions/AddTransactionDrawer";
import AddTransactionButton from "~/components/transactions/list/AddTransactionButton";
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
      <PageHeader
        icon={<CreditCardIcon className="size-5" aria-hidden="true" />}
        title="Transactions"
        description="Manage every income and expense, filter and audit your activity."
        actions={
          <div className="hidden md:block">
            <AddTransactionButton />
          </div>
        }
      />

      <TransactionsList />
      <AddTransactionDrawer />
    </div>
  );
}
