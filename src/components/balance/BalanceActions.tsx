import { useNavigate } from "@tanstack/react-router";
import AddTransactionButton from "~/components/transactions/list/add-transaction-button";
import { BarChart3Icon, ListIcon, PlusIcon } from "lucide-react";

import { ActionButton } from "./ActionButton";

const ACTION_ITEM_WIDTH_CLASS = "w-24 sm:w-28";

export function BalanceActions() {
  const navigate = useNavigate();

  return (
    <div className="mt-5 flex items-start justify-center gap-1 sm:gap-5">
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
      <ActionButton
        icon={<BarChart3Icon />}
        label="Reports"
        onClick={() => navigate({ to: "/reports" })}
        widthClassName={ACTION_ITEM_WIDTH_CLASS}
      />
      <ActionButton
        icon={<ListIcon />}
        label="Categories"
        onClick={() => navigate({ to: "/categories" })}
        widthClassName={ACTION_ITEM_WIDTH_CLASS}
      />
    </div>
  );
}
