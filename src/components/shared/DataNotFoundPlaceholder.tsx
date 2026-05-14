import { ReactNode } from "react";

export const DataNotFoundPlaceholder = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="text-muted-foreground flex items-center justify-center py-12 text-center font-medium">
      {children}
    </div>
  );
};
