import { ReactNode } from "react";

export const PageTitle = ({
  children,
  description,
}: {
  children: ReactNode;
  description?: ReactNode;
}) => {
  return (
    <h1 className="text-2xl font-bold flex flex-col gap-2">
      <span className="flex items-center">{children}</span>
      <span className="text-muted-foreground text-sm">{description}</span>
    </h1>
  );
};
