import { useNavigate } from "@tanstack/react-router";
import AddTransactionButton from "~/components/transactions/list/AddTransactionButton";
import {
  BarChart3Icon,
  CalculatorIcon,
  FolderTreeIcon,
  HandCoinsIcon,
  PlusIcon,
} from "lucide-react";

import { ActionButton } from "./ActionButton";

export function BalanceActions() {
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-4 md:justify-start">
      <ActionButton
        icon={<BarChart3Icon />}
        label="Reports"
        onClick={() => navigate({ to: "/home/reports" })}
        variant={"outline"}
        description="Spending patterns, income sources and financial trends over time."
      />
      <ActionButton
        icon={<FolderTreeIcon />}
        label="Categories"
        onClick={() => navigate({ to: "/home/categories" })}
        variant={"outline"}
        description="Organize spending with custom categories and icons."
      />
      <ActionButton
        icon={<CalculatorIcon />}
        label="Calculator"
        onClick={() => navigate({ to: "/home/balance-calculator" })}
        variant={"outline"}
        description="Quickly total balances and test what-if amounts."
      />
      <ActionButton
        icon={<HandCoinsIcon />}
        label="Loans"
        onClick={() => navigate({ to: "/home/loans" })}
        variant={"outline"}
        description="Track money others owe you and what you owe to others."
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
