import { useNavigate } from "@tanstack/react-router";
import AddTransactionButton from "~/components/transactions/list/AddTransactionButton";
import {
  BarChart3Icon,
  CalculatorIcon,
  ListIcon,
  PlusIcon,
} from "lucide-react";

import { ActionButton } from "./ActionButton";

export function BalanceActions() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-wrap justify-between md:justify-start w-full gap-4 mt-4">
      <ActionButton
        icon={<BarChart3Icon />}
        label="Reports"
        onClick={() => navigate({ to: "/home/reports" })}
        variant={"outline"}
        description="View detailed reports and insights about your finances, including spending patterns, income sources, and financial trends over time."
      />
      <ActionButton
        icon={<ListIcon />}
        label="Categories"
        onClick={() => navigate({ to: "/home/categories" })}
        variant={"outline"}
      />
      <ActionButton
        icon={<CalculatorIcon />}
        label="Calculator"
        onClick={() => navigate({ to: "/home/balance-calculator" })}
        variant={"outline"}
      />
      <AddTransactionButton
        customTrigger={
          <ActionButton
            icon={<PlusIcon />}
            label="Add transaction"
            variant="default"
          />
        }
      />
    </div>
  );
}
