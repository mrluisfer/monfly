import { SearchIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type TransactionSearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** Unique id so the field and its sr-only label stay associated. */
  id: string;
  placeholder?: string;
  /** Applied to the wrapper — use it for width constraints (e.g. `xl:max-w-sm`). */
  className?: string;
  /** Accessible name, rendered as an sr-only `<label>`. */
  label?: string;
};

/**
 * The single search field used by both the desktop table toolbar and the mobile
 * list. Previously each spot rendered its own `Input` with slightly different
 * styling (the desktop one even lacked the leading icon), so they never matched
 * — this keeps the icon, sizing and a11y label in one place.
 */
export function TransactionSearchInput({
  value,
  onValueChange,
  id,
  placeholder = "Search transactions...",
  className,
  label = "Search transactions",
}: TransactionSearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <SearchIcon
        className="text-muted-foreground/70 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        id={id}
        type="search"
        inputMode="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className="border-border/70 bg-background/70 h-11 rounded-full pl-10"
      />
    </div>
  );
}
