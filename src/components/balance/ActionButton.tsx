import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];

export function ActionButton({
  icon,
  label,
  description,
  variant = "default",
  ...props
}: Omit<React.ComponentProps<typeof TooltipTrigger>, "render" | "children"> & {
  icon: React.ReactNode;
  label: string;
  description?: string;
  variant?: ButtonVariant;
}) {
  return (
    <Tooltip>
      {/* ponytail: extra props (and `ref`) go on TooltipTrigger, not on the
          `render` element — that's what lets this compose as another popup's
          trigger (e.g. DialogTrigger render={<ActionButton/>}), which needs its
          ref + aria-haspopup/aria-expanded to reach this same DOM node.
          Putting `id` on the `render` element instead silently kills hover:
          Base UI matches the open popup against the trigger's DOM id. */}
      <TooltipTrigger
        {...props}
        render={<Button size={"lg"} variant={variant} className={"flex-1"} />}
      >
        {icon}
        <span className="block truncate font-semibold text-sm tracking-tight">
          {label}
        </span>
      </TooltipTrigger>
      {description ? <TooltipContent>{description}</TooltipContent> : null}
    </Tooltip>
  );
}
