import type { NumberFormatId } from "~/constants/number-formats";

/** Anything that is not a digit, a separator or a sign. */
const NOISE = /[^\d.,-]/g;
const SIGN = /-/g;
const SEPARATORS = /[.,]/g;

/**
 * What the two separators mean, once `auto` has been resolved:
 * `dot-decimal` is `1,234.56`, `comma-decimal` is `1.234,56`.
 */
export type DecimalConvention = "dot-decimal" | "comma-decimal";

/** Locale to hand `Intl` when writing a number back out, per convention. */
const CONVENTION_LOCALE: Record<DecimalConvention, string> = {
  "comma-decimal": "de-DE",
  "dot-decimal": "en-US",
};

/**
 * Turns the stored preference into a concrete convention. `auto` is *not* a
 * per-value guess — `1,250` is either 1250 or 1.25 and no amount of staring at
 * it decides which — so it follows the locale the user's money is already
 * formatted in (MXN → `es-MX` → `1,234.56`).
 */
export function resolveDecimalConvention(
  preference: NumberFormatId,
  locale: string,
): DecimalConvention {
  if (preference !== "auto") {
    return preference;
  }

  try {
    const decimal = new Intl.NumberFormat(locale)
      .formatToParts(1234.5)
      .find((part) => part.type === "decimal")?.value;
    return decimal === "," ? "comma-decimal" : "dot-decimal";
  } catch {
    return "dot-decimal";
  }
}

/**
 * Reads a number the way a person typed or pasted it — `1,234.56`, `1.250`,
 * `-12,5` — under the convention the user reads in. Returns `null` when there
 * is no number in there at all.
 */
export function parseFormattedNumber(
  rawText: string,
  convention: DecimalConvention,
): number | null {
  const cleaned = rawText.replace(NOISE, "").trim();
  const digits = cleaned.replace(SIGN, "");
  if (!digits) {
    return null;
  }

  const decimalIdx = findDecimalIndex(digits, convention);
  const integerPart = (
    decimalIdx === -1 ? digits : digits.slice(0, decimalIdx)
  ).replace(SEPARATORS, "");
  const decimalPart =
    decimalIdx === -1
      ? ""
      : digits.slice(decimalIdx + 1).replace(SEPARATORS, "");

  if (!(integerPart || decimalPart)) {
    return null;
  }

  const sign = cleaned.startsWith("-") ? "-" : "";
  const parsed = Number(
    `${sign}${integerPart || "0"}${decimalPart ? `.${decimalPart}` : ""}`,
  );
  return Number.isFinite(parsed) ? parsed : null;
}

/** Index of the separator acting as the decimal point, or -1 if there is none. */
function findDecimalIndex(
  digits: string,
  convention: DecimalConvention,
): number {
  const lastDot = digits.lastIndexOf(".");
  const lastComma = digits.lastIndexOf(",");

  // Both present: the rightmost one is the decimal in *every* convention — a
  // grouping separator can never sit to the right of the decimal one. This is
  // a fact, not a guess, so it also rescues a value pasted from a region that
  // writes numbers the other way around.
  if (lastDot !== -1 && lastComma !== -1) {
    return Math.max(lastDot, lastComma);
  }

  // A lone separator means whatever the convention says it means: under
  // `dot-decimal`, `1,250` is one thousand two hundred fifty and `1.250` is
  // one and a quarter. Under `comma-decimal` it is exactly the other way.
  return convention === "comma-decimal" ? lastComma : lastDot;
}

/**
 * Writes a number back the way the user reads it — grouped, `1250` → `1,250`.
 * Feeds editable fields, so callers must only apply it when the caret is not
 * in play (on blur, on load), never on every keystroke.
 */
export function formatNumberForInput(
  value: number,
  convention: DecimalConvention,
): string {
  return new Intl.NumberFormat(CONVENTION_LOCALE[convention], {
    // Never round the user's own number behind their back.
    maximumFractionDigits: 20,
    useGrouping: true,
  }).format(value);
}

// ponytail: whitelist regex + Function instead of a parser or mathjs. Only
// digits and + - * / ( ) . survive, so nothing else can be evaluated.
// Swap for a real parser if we ever need variables or functions.
const SAFE = /^[\d+\-*/().\s]+$/;

/** Every run of digits and separators — one number literal in an expression. */
const NUMERIC_TOKEN = /[\d.,]+/g;

/**
 * Evaluates an arithmetic expression ("12+20") or a plain number, reading each
 * literal under the user's convention so `1.234,56 + 10` means the same thing
 * to a European reader as `1,234.56 + 10` does to a Mexican one. Null if
 * invalid.
 *
 * The separators are normalised away *before* the whitelist runs, so a literal
 * we could not read (a stray comma, say) still fails the check.
 */
export function evalAmount(
  expression: string,
  convention: DecimalConvention = "dot-decimal",
): number | null {
  const normalized = expression.replace(NUMERIC_TOKEN, (token) => {
    const parsed = parseFormattedNumber(token, convention);
    return parsed === null ? token : String(parsed);
  });

  if (!SAFE.test(normalized)) {
    return null;
  }
  try {
    const result = Function(`"use strict";return(${normalized})`)();
    return typeof result === "number" && Number.isFinite(result)
      ? result
      : null;
  } catch {
    return null;
  }
}
