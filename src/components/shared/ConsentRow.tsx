import { useId } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "~/components/ui/form";
import { cn } from "~/lib/utils";

type ConsentRowProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: React.ReactNode;
  description: string;
  error?: string;
};

/** Legal acknowledgement checkbox. Shared by signup and account settings so
 *  both surfaces show the exact same wording. */
export function ConsentRow({
  checked,
  onCheckedChange,
  title,
  description,
  error,
}: ConsentRowProps) {
  const id = useId();
  return (
    <FormItem
      className={cn(
        "flex flex-row items-start gap-3 px-0 py-3 transition-colors first:pt-0 last:pb-0",
        error && "bg-destructive/5 rounded-lg px-3",
      )}
    >
      <FormControl>
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          aria-describedby={`${id}-desc`}
          className="mt-0.5"
        />
      </FormControl>
      <div className="min-w-0 space-y-0.5">
        <FormLabel htmlFor={id} className="text-sm font-medium">
          {title}
        </FormLabel>
        <p id={`${id}-desc`} className="text-muted-foreground text-xs">
          {description}
        </p>
        {error ? (
          <p className="text-destructive text-xs font-medium" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </FormItem>
  );
}
