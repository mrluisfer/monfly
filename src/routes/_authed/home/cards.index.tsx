import { createFileRoute } from "@tanstack/react-router";
import { CreditCardIcon } from "lucide-react";

import AddCard from "~/components/cards/AddCard";
import { CardsList } from "~/components/cards/CardsList";
import { PageHeader } from "~/components/layout/PageHeader";

export const Route = createFileRoute("/_authed/home/cards/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        icon={<CreditCardIcon className="size-5" aria-hidden="true" />}
        title="Cards"
        description="Manage your cards and accounts, and track each balance separately."
      />

      <AddCard />
      <CardsList />
    </div>
  );
}
