import { useNavigate } from "@tanstack/react-router";
import AddTransactionButton from "~/components/transactions/list/add-transaction-button";
import {
  BarChart3Icon,
  CalculatorIcon,
  ListIcon,
  PlusIcon,
} from "lucide-react";

import { ActionButton } from "./ActionButton";

const ACTION_ITEM_WIDTH_CLASS = "w-full sm:w-24 md:w-28";

export function BalanceActions() {
  const navigate = useNavigate();

  return (
    <div className="mt-5 grid grid-cols-2 items-start gap-3 sm:flex sm:justify-center sm:gap-4">
      <ActionButton
        icon={<BarChart3Icon />}
        label="Reports"
        onClick={() => navigate({ to: "/reports" })}
        widthClassName={ACTION_ITEM_WIDTH_CLASS}
        variant={"outline"}
      />
      <ActionButton
        icon={<ListIcon />}
        label="Categories"
        onClick={() => navigate({ to: "/categories" })}
        widthClassName={ACTION_ITEM_WIDTH_CLASS}
        variant={"outline"}
      />
      <ActionButton
        icon={<CalculatorIcon />}
        label="Calculator"
        onClick={() => navigate({ to: "/balance-calculator" })}
        widthClassName={ACTION_ITEM_WIDTH_CLASS}
        variant={"outline"}
      />
      <AddTransactionButton
        customTrigger={
          <ActionButton
            icon={<PlusIcon />}
            label="Add"
            variant="default"
            widthClassName={ACTION_ITEM_WIDTH_CLASS}
          />
        }
      />
    </div>
  );
}
