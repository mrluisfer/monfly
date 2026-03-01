import { createFileRoute } from "@tanstack/react-router";
import { BalanceCalculator } from "~/components/balance/BalanceCalculator";
import { PageTitle } from "~/components/page-title";

export const Route = createFileRoute("/_authed/balance-calculator/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <PageTitle description="Simulate operations using your total balance without changing real data.">
          Balance Calculator
        </PageTitle>
      </header>

      <BalanceCalculator />
    </div>
  );
}
