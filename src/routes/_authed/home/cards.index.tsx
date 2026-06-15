import { createFileRoute } from "@tanstack/react-router";
import { CreditCardIcon, WalletCardsIcon } from "lucide-react";

import AddCard from "~/components/cards/AddCard";
import { CardsInsights } from "~/components/cards/CardsInsights";
import { CardsList } from "~/components/cards/CardsList";
import { PageHeader } from "~/components/layout/PageHeader";
import { Section } from "~/components/layout/Section";
import { StatusBadge } from "~/components/ui/status-badge";
import { useCards } from "~/hooks/cards";

export const Route = createFileRoute("/_authed/home/cards/")({
  component: RouteComponent,
});

function CardsCountBadge() {
  const { data } = useCards();
  const count = data?.data?.length ?? 0;
  if (count === 0) return null;
  return (
    <StatusBadge variant="primary" size="md" icon={<WalletCardsIcon />}>
      {count} {count === 1 ? "card" : "cards"}
    </StatusBadge>
  );
}

function RouteComponent() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        className="mt-4 md:mt-0"
        icon={<CreditCardIcon className="size-5" aria-hidden="true" />}
        title="Cards"
        description="Manage your cards and accounts, and track each balance separately."
        actions={<CardsCountBadge />}
      />

      <CardsInsights />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:items-start">
        <div className="xl:sticky xl:top-6">
          <AddCard />
        </div>

        <Section
          title="Your cards"
          description="Active and archived cards across your workspace."
        >
          <CardsList />
        </Section>
      </div>
    </div>
  );
}
