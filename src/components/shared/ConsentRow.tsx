import { useId } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "~/components/ui/form";
import { cn } from "~/lib/utils";

interface ConsentRowProps {
  checked: boolean;
  description: string;
  error?: string;
  onCheckedChange: (checked: boolean) => void;
  title: React.ReactNode;
}

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
        error && "rounded-lg bg-destructive/5 px-3",
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
        <FormLabel htmlFor={id} className="font-medium text-sm">
          {title}
        </FormLabel>
        <p id={`${id}-desc`} className="text-muted-foreground text-xs">
          {description}
        </p>
        {error ? (
          <p className="font-medium text-destructive text-xs" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </FormItem>
  );
}
