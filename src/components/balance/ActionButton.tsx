import { useId } from "react";
import { cn } from "~/lib/utils";

import { Button } from "../ui/button";

const ACTION_LABEL_CLASS =
  "block w-full truncate text-center text-xs leading-tight text-muted-foreground";

export function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
  widthClassName,
}: {
  icon: React.ReactNode;
  label: string;
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
    <div
      className={cn(
        "group grid cursor-pointer justify-items-center gap-1.5",
        widthClassName
      )}
    >
      <Button
        size={"icon-lg"}
        className="rounded-full"
        onClick={onClick}
        variant={variant}
        id={id}
        name={label}
        aria-labelledby={labelId}
      >
        {icon}
      </Button>
      <span id={labelId} className={ACTION_LABEL_CLASS} title={label}>
        {label}
      </span>
    </div>
  );
}
