import { EqualIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useDecimalConvention } from "~/hooks/ui/useDecimalConvention";
import {
  type DecimalConvention,
  evalAmount,
  formatNumberForInput,
} from "~/utils/parse-number";

type AmountInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  /** Always a plain dot-decimal numeric string ("1234.56"), never the raw
   *  expression and never the user's display separator. */
  value: string;
  onChange: (value: string) => void;
};

/**
 * Number input that accepts arithmetic ("12+20") and thousands/decimal
 * separators in whichever convention the user reads in, while always emitting
 * a machine-readable `1234.56` upwards.
 *
 * The grouped form is only ever written when the caret is not in the field —
 * on load, and on the blur/Tab that applies a result — so typing is never
 * interrupted by separators appearing under the cursor.
 */
export function AmountInput({ value, onChange, ...props }: AmountInputProps) {
  const convention = useDecimalConvention();

  const [raw, setRaw] = useState(() => toDisplay(value, convention));
  const [emitted, setEmitted] = useState(value);
  const [shownAs, setShownAs] = useState(convention);

  // Re-sync when the parent resets the value (e.g. dialog reopened), and when
  // the stored preference lands after hydration or changes in settings.
  if (value !== emitted || convention !== shownAs) {
    setEmitted(value);
    setShownAs(convention);
    setRaw(toDisplay(value, convention));
  }

  const result = evalAmount(raw, convention);
  const formattedResult =
    result === null ? "" : formatNumberForInput(result, convention);
  // Worth surfacing only when the field does not already read as its own
  // value: an expression ("12+20"), or text the convention reinterprets
  // ("1.250" → 1.25). Plain "1250" just picks up its grouping on blur, with
  // no "press Tab to apply" noise for a number that is already correct.
  const preview =
    result !== null &&
    formattedResult !== raw.trim() &&
    String(result) !== raw.trim();

  const handleChange = (next: string) => {
    setRaw(next);
    const parsed = evalAmount(next, convention);
    const outgoing = parsed === null ? "" : String(parsed);
    setEmitted(outgoing);
    onChange(outgoing);
  };

  const apply = () => result !== null && setRaw(formattedResult);

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
        {preview ? (
          <Button
            type="button"
            size="icon-lg"
            variant="secondary"
            aria-label={`Apply result ${formattedResult}`}
            className="shrink-0 lg:hidden"
            // Keep focus in the input so the keyboard stays open.
            onPointerDown={(e) => e.preventDefault()}
            onClick={apply}
          >
            <EqualIcon className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
      {preview ? (
        <span className="text-muted-foreground text-xs tabular-nums">
          = {formattedResult}{" "}
          <span className="hidden opacity-60 lg:inline">
            (press Tab to apply)
          </span>
        </span>
      ) : null}
    </>
  );
}

/** The stored dot-decimal value, rendered the way the user reads numbers. */
function toDisplay(value: string, convention: DecimalConvention): string {
  if (!value) {
    return "";
  }
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? formatNumberForInput(numeric, convention)
    : value;
}
