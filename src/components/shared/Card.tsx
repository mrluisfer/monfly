import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as CardUI,
} from "../ui/card";

const Card = ({
  children,
  className,
  title,
  subtitle,
  Footer,
  cardContentProps,
}: {
  children: ReactNode;
  className?: string;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  Footer?: ReactNode;
  cardContentProps?: ComponentProps<"div">;
}) => (
  <CardUI className={clsx("h-fit", className)}>
    {title ? (
      <CardHeader>
        <CardTitle className="text-foreground">
          {title}
          <CardDescription>{subtitle}</CardDescription>
        </CardTitle>
      </CardHeader>
    ) : null}
    <CardContent {...cardContentProps}>{children}</CardContent>
    {Footer ? <CardFooter>{Footer}</CardFooter> : null}
  </CardUI>
);

export default Card;
