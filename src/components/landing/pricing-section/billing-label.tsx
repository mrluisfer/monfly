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
          ? "text-foreground opacity-100"
          : "text-muted-foreground opacity-60",
        "flex min-w-[6.5rem] items-center gap-2 text-sm font-semibold transition-opacity duration-150 sm:min-w-[7.5rem]",
        className
      )}
    >
      {children}
    </span>
  );
}
