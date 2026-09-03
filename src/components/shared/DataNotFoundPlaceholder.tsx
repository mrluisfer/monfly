import type { ReactNode } from "react";

export const DataNotFoundPlaceholder = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="flex items-center justify-center py-12 text-center font-medium text-muted-foreground">
    {children}
  </div>
);
