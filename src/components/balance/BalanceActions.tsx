import { useNavigate } from "@tanstack/react-router";
import AddTransactionButton from "~/components/transactions/list/AddTransactionButton";
import {
  BarChart3Icon,
  CalculatorIcon,
  ListIcon,
  PlusIcon,
} from "lucide-react";

import { ActionButton } from "./ActionButton";

const ACTION_ITEM_WIDTH_CLASS = "w-full";

export function BalanceActions() {
  const navigate = useNavigate();

  return (
    <section className="finance-panel rounded-[1.75rem] p-4 sm:p-5">
      <div className="flex flex-col gap-1.5 pb-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Quick actions
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Shortcuts
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
              label="Add transaction"
              variant="default"
              widthClassName={ACTION_ITEM_WIDTH_CLASS}
            />
          }
        />
      </div>
    </section>
  );
}
