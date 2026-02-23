import { useNavigate } from "@tanstack/react-router";
import AddTransactionButton from "~/components/transactions/list/add-transaction-button";
import { BarChart3Icon, ListIcon, PlusIcon } from "lucide-react";

export function BalanceActions() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center gap-5 mt-5">
      <AddTransactionButton
        customTrigger={
          <ActionButton
            icon={<PlusIcon className="size-5" />}
            label="Add"
            variant="primary"
          />
        }
      />
      <ActionButton
        icon={<BarChart3Icon className="size-5" />}
        label="Reports"
        onClick={() => navigate({ to: "/reports" })}
      />
      <ActionButton
        icon={<ListIcon className="size-5" />}
        label="Categories"
        onClick={() => navigate({ to: "/categories" })}
      />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "default";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
    >
      <span
        className={`
          flex size-12 items-center justify-center rounded-full
          transition-all duration-200
          active:scale-90
          ${
            variant === "primary"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30"
              : "bg-muted/80 text-muted-foreground group-hover:bg-muted"
          }
        `}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </button>
  );
}
