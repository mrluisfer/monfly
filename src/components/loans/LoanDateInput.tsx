import { type ChangeEvent, useCallback } from "react";

import { Input } from "~/components/ui/input";
import { fromDateInputValue, toDateInputValue } from "./date-input";

interface LoanDateInputProps {
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: Date | null) => void;
  value: Date | null | undefined;
}

/**
 * `input[type=date]` bound to a `Date`. Owning the conversion here keeps the
 * change handler stable, so call sites hand over `field.onChange` directly.
 */
export function LoanDateInput({
  value,
  onValueChange,
  ...props
}: LoanDateInputProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange(fromDateInputValue(event.target.value));
    },
    [onValueChange],
  );

  return (
    <Input
      type="date"
      value={toDateInputValue(value)}
      onChange={handleChange}
      {...props}
    />
  );
}
