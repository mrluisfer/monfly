import { sonnerPositions } from "~/constants/sonner-positions";
import { useSonnerPosition } from "~/hooks/ui/useSonnerPosition";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import type { SonnerPosition } from "~/types/SonnerPosition";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

/** A tiny "screen" with a dot in the corner, mirroring where toasts will appear. */
function PositionGlyph({
  position,
  className,
}: {
  position: SonnerPosition;
  className?: string;
}) {
  const [vertical, horizontal] = position.split("-");
  return (
    <span
      aria-hidden="true"
      className={cn(
        "border-border/70 bg-muted/40 relative inline-flex h-4 w-5 shrink-0 rounded-[3px] border",
        className,
      )}
    >
      <span
        className={cn(
          "bg-primary absolute size-1.5 rounded-full",
          vertical === "top" ? "top-0.5" : "bottom-0.5",
          horizontal === "left" && "left-0.5",
          horizontal === "right" && "right-0.5",
          horizontal === "center" && "left-1/2 -translate-x-1/2",
        )}
      />
    </span>
  );
}

const POSITION_GROUPS = [
  {
    label: "Top",
    items: sonnerPositions.filter((p) => p.value.startsWith("top")),
  },
  {
    label: "Bottom",
    items: sonnerPositions.filter((p) => p.value.startsWith("bottom")),
  },
];

export const SonnerPositionSelector = () => {
  const { position, setPosition } = useSonnerPosition();

  const handlePositionChange = (value: SonnerPosition) => {
    setPosition(value);
    sileo.info({
      title: "Notification position updated",
      description:
        sonnerPositions.find((p) => p.value === value)?.name ?? value,
    });
  };

  return (
    <Select
      value={position}
      onValueChange={(value) => {
        if (value) handlePositionChange(value as SonnerPosition);
      }}
    >
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="Select a position">
          {(value: SonnerPosition) => {
            const item = sonnerPositions.find((p) => p.value === value);
            return (
              <span className="flex items-center gap-2">
                <PositionGlyph position={value} />
                <span>{item?.name ?? "Select a position"}</span>
              </span>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {POSITION_GROUPS.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <span className="flex items-center gap-2">
                  <PositionGlyph position={item.value} />
                  <span>{item.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
