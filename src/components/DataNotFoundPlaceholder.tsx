import { ReactNode } from "react";

export const DataNotFoundPlaceholder = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="py-12 text-center font-medium text-muted-foreground flex items-center justify-center">
      {children}
    </div>
  );
};
