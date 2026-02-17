import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  Group,
  Label,
  NumberField,
} from "react-aria-components";

interface BalanceEditorProps {
  value: string;
  onChange: (value: string) => void;
  isSubmitting?: boolean;
}

export function BalanceEditor({
  value,
  onChange,
  isSubmitting,
}: BalanceEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <NumberField
      value={Number(value)}
      onChange={(val) => onChange(val !== null ? val.toString() : "")}
      formatOptions={{
        style: "currency",
        currency: "MXN",
        currencySign: "accounting",
      }}
      isDisabled={isSubmitting}
    >
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground sm:text-sm">
          Balance Amount
        </Label>
        <Group className="relative inline-flex h-10 w-full items-center overflow-hidden rounded-md border border-input bg-background text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 sm:h-11">
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-foreground/80">
            $
          </span>
          <AriaInput
            className="flex-1 bg-transparent px-3 py-2 ps-6 text-base text-foreground tabular-nums outline-none sm:text-lg"
            value={value}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <div className="flex h-[calc(100%+2px)] flex-col border-s border-input">
            <AriaButton
              slot="increment"
              className="flex h-1/2 w-7 flex-1 items-center justify-center bg-background text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronUpIcon size={12} aria-hidden="true" />
            </AriaButton>
            <AriaButton
              slot="decrement"
              className="-mt-px flex h-1/2 w-7 flex-1 items-center justify-center border-t border-input bg-background text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronDownIcon size={12} aria-hidden="true" />
            </AriaButton>
          </div>
        </Group>
      </div>
    </NumberField>
  );
}
