import { ElementType, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "~/lib/utils";

type TypographyProps = {
  children: ReactNode;
  asChild?: boolean;
  as?: ElementType;
  className?: string;
  variant?: "muted" | "foreground" | "primary" | "danger" | "success";
};

const variantClasses: Record<string, string> = {
  muted: "text-gray-400",
  foreground: "text-gray-900 dark:text-primary",
  primary: "text-primary",
  danger: "text-red-500",
  success: "text-green-600",
};

/**
 * Typography component for consistent text styling.
 * @param param0 - Props for the Typography component.
 * @returns The rendered Typography component.
 * @example
 * <Typography variant="muted">Muted text</Typography>
 * <Typography variant="primary" as="p">Primary paragraph</Typography>
 * <Typography variant="danger">Danger!</Typography>
 */
export function Typography({
  children,
  asChild,
  as: Tag = "span",
  className,
  variant = "foreground",
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLElement>) {
  const Comp = asChild ? Slot : Tag;
  return (
    <Comp className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Comp>
  );
}
