import { useId } from "react";
import { cn } from "~/lib/utils";

import { Button } from "../ui/button";

export function ActionButton({
  icon,
  label,
  description,
  onClick,
  variant = "default",
  widthClassName,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  widthClassName?: string;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null;
}) {
  const id = useId();
  const labelId = `${id}-label`;

  return (
    <div className={cn("group grid")}>
      <Button
        size={"lg"}
        onClick={onClick}
        variant={variant}
        id={id}
        name={label}
        aria-labelledby={labelId}
        className={cn(
          "h-auto min-h-20 justify-start rounded-[1.1rem] px-4 py-3.5 text-left shadow-none",
          variant === "outline" &&
            "finance-chip border-border/75 bg-background/70 hover:bg-background/90",
          variant === "default" &&
            "bg-primary text-primary-foreground shadow-[0_24px_40px_-32px_color-mix(in_oklab,var(--primary)_65%,transparent)] hover:bg-primary/92",
          widthClassName
        )}
        >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            variant === "default"
              ? "bg-primary-foreground/16 text-primary-foreground"
              : "bg-primary/10 text-primary"
          )}
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span
            id={labelId}
            className="block truncate text-sm font-semibold tracking-tight"
          >
            {label}
          </span>
          {description && (
            <span
              className={cn(
                "mt-1 block text-xs leading-5",
                variant === "default"
                  ? "text-primary-foreground/78"
                  : "text-muted-foreground"
              )}
            >
              {description}
            </span>
          )}
        </span>
      </Button>
    </div>
  );
}
