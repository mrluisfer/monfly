import { useMemo } from "react";
import { UserRoundIcon } from "lucide-react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import { useLoanDebtors } from "~/hooks/loans";
import { useIsDesktop } from "~/hooks/ui";

type DebtorComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Field name, forwarded to the underlying input for RHF/autofill. */
  name?: string;
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Free-text name field for a loan's counterparty (debtor or creditor) that also
 * suggests names the user has saved on previous loans. Typing keeps whatever is
 * entered (so brand-new names still save), while past names can be picked from
 * the dropdown instead of being retyped.
 *
 * The suggestion list is capped to 5 matches on phones/tablets and 10 on
 * desktop — enough to scan without overflowing a small viewport.
 */
export function DebtorCombobox({
  value,
  onChange,
  onBlur,
  name,
  placeholder,
  disabled,
}: DebtorComboboxProps) {
  const isDesktop = useIsDesktop();
  const limit = isDesktop ? 10 : 5;

  const { data } = useLoanDebtors();
  const suggestions = useMemo(() => {
    const names = (data?.data as string[] | null) ?? [];
    // Drop the value the user is currently typing so it isn't echoed back as a
    // suggestion duplicate of what's already in the field.
    const current = value.trim().toLowerCase();
    return names.filter((n) => n.toLowerCase() !== current);
  }, [data, value]);

  const hasSuggestions = suggestions.length > 0;

  return (
    <Combobox
      items={suggestions}
      // Both the input text and the selected value are bound to the field. The
      // selected value matters because Base UI's single-select mode re-syncs the
      // input to the selected value's label when the popup closes — leaving it
      // uncontrolled would blank a pre-filled name as soon as you click away.
      // We provide our own `filter` so matching stays driven by the typed query
      // (the default single-select filter shows everything once the query equals
      // the selected value, which would be always here).
      value={value}
      onValueChange={(next) => onChange(next ?? "")}
      inputValue={value}
      onInputValueChange={(next) => onChange(next)}
      filter={(item, query) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return String(item).toLowerCase().includes(q);
      }}
      limit={limit}
      autoHighlight
      openOnInputClick={hasSuggestions}
    >
      <ComboboxInput
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        showTrigger={hasSuggestions}
        showClear={value.length > 0}
        onBlur={onBlur}
      />

      {hasSuggestions && (
        <ComboboxContent>
          <ComboboxEmpty>No saved names match.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                <UserRoundIcon className="text-muted-foreground size-4" />
                <span className="truncate">{item}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
}
