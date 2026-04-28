import { createFileRoute } from "@tanstack/react-router";
import { CalculatorIcon } from "lucide-react";
import { BalanceCalculator } from "~/components/balance/BalanceCalculator";
import { PageHeader } from "~/components/layout/PageHeader";

export const Route = createFileRoute("/_authed/home/balance-calculator/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        icon={<CalculatorIcon className="size-5" aria-hidden="true" />}
        title="Balance Calculator"
        description="Simulate operations using your total balance without changing real data."
      />

      <BalanceCalculator />
    </div>
  );
}
