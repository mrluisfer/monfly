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
        {icon}
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
