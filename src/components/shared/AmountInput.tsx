import { EqualIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// ponytail: whitelist regex + Function instead of a parser or mathjs. Only
// digits and + - * / ( ) . survive, so nothing else can be evaluated.
// Swap for a real parser if we ever need variables or functions.
const SAFE = /^[\d+\-*/().\s]+$/;

/** Evaluates an arithmetic expression ("12+20") or a plain number. Null if invalid. */
export function evalAmount(expression: string): number | null {
  if (!SAFE.test(expression)) return null;
  try {
    const result = Function(`"use strict";return(${expression})`)();
    return typeof result === "number" && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

type AmountInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  /** Always the evaluated numeric string ("32"), never the raw expression. */
  value: string;
  onChange: (value: string) => void;
};

/** Number input that accepts arithmetic ("12+20") and previews the result. */
export function AmountInput({ value, onChange, ...props }: AmountInputProps) {
  const [raw, setRaw] = useState(value);
  const [emitted, setEmitted] = useState(value);

  // Re-sync when the parent resets the value (e.g. dialog reopened).
  if (value !== emitted) {
    setEmitted(value);
    setRaw(value);
  }

  const result = evalAmount(raw);
  const preview = result !== null && String(result) !== raw.trim();

  const handleChange = (next: string) => {
    setRaw(next);
    const parsed = evalAmount(next);
    const outgoing = parsed === null ? "" : String(parsed);
    setEmitted(outgoing);
    onChange(outgoing);
  };

  const apply = () => result !== null && setRaw(String(result));

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={raw}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={apply}
          onKeyDown={(e) => {
            // First Tab applies the result and keeps focus; a second Tab leaves.
            if (e.key === "Tab" && preview && !e.shiftKey) {
              e.preventDefault();
              apply();
            }
          }}
          {...props}
        />
        {/* ponytail: CSS breakpoint instead of useIsMobile — no hydration
            mismatch, and Tab already covers keyboards from lg up. */}
        {preview && (
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            aria-label={`Apply result ${result}`}
            className="shrink-0 lg:hidden"
            // Keep focus in the input so the keyboard stays open.
            onPointerDown={(e) => e.preventDefault()}
            onClick={apply}
          >
            <EqualIcon className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      {preview && (
        <span className="text-muted-foreground text-xs tabular-nums">
          = {result}{" "}
          <span className="hidden opacity-60 lg:inline">
            (press Tab to apply)
          </span>
        </span>
      )}
    </>
  );
}
