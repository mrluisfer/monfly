import type { ReactNode } from "react";

type InsightsGridProps = {
  children: ReactNode;
};

/** Responsive grid layout shared by the insights cards and their skeletons. */
export function InsightsGrid({ children }: InsightsGridProps) {
  return (
    <dl className="4xl:grid-cols-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
      {children}
    </dl>
  );
}
