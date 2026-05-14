import { createFileRoute, Link } from "@tanstack/react-router";
import { CalculatorIcon, SettingsIcon } from "lucide-react";
import { BalanceCalculator } from "~/components/balance/BalanceCalculator";
import { PageHeader } from "~/components/layout/PageHeader";
import { NumberFormatBadge } from "~/components/settings/NumberFormatBadge";
import { Button } from "~/components/ui/button";

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
        actions={
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Number format
            </span>
            <NumberFormatBadge />
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              render={<Link to="/user/settings" />}
              className="px-1"
            >
              <SettingsIcon className="size-3.5" aria-hidden="true" />
              Change
            </Button>
          </div>
        }
      />

      <BalanceCalculator />
    </div>
  );
}
