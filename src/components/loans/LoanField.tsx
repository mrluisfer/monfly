import type { ReactNode } from "react";

interface LoanFieldProps {
  children: ReactNode;
  error?: string;
  icon?: ReactNode;
  label: string;
}

/** Labeled form field with an optional leading icon and inline error message. */
export function LoanField({ label, error, icon, children }: LoanFieldProps) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="inline-flex items-center gap-1 font-medium text-muted-foreground text-xs">
        {/* The icon carries the brand color while the label text stays muted —
            owned here so every field (add + edit forms) stays consistent. */}
        {icon ? <span className="inline-flex text-primary">{icon}</span> : null}
        {label}
      </span>
      {children}
      {error ? (
        <span role="alert" className="text-destructive text-xs">
          {error}
        </span>
      ) : null}
    </label>
  );
}
