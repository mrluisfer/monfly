import { cn } from "~/lib/utils";

export function BillingLabel({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        active
          ? "text-gray-900 dark:text-primary opacity-100"
          : "text-muted-foreground opacity-60",
        "transition font-semibold flex items-center gap-2 w-[12rem]",
        className
      )}
    >
      {children}
    </span>
  );
}
