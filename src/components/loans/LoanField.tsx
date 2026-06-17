import type { ReactNode } from "react";

type LoanFieldProps = {
  label: string;
  error?: string;
  icon?: ReactNode;
  children: ReactNode;
};

/** Labeled form field with an optional leading icon and inline error message. */
export function LoanField({ label, error, icon, children }: LoanFieldProps) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
        {/* The icon carries the brand color while the label text stays muted —
            owned here so every field (add + edit forms) stays consistent. */}
        {icon && <span className="text-primary inline-flex">{icon}</span>}
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="text-destructive text-xs">
          {error}
        </span>
      )}
    </label>
  );
}
