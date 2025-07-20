import { useId } from "react";
import { fontsDisplay } from "~/constants/fonts-display";
import { useFontDisplay } from "~/hooks/use-font-display";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Square = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    data-square
    className={cn(
      "bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium",
      className
    )}
    aria-hidden="true"
  >
    {children}
  </span>
);

const fontSelectClassName = [
  "bg-indigo-400/20 text-indigo-500",
  "bg-purple-400/20 text-purple-500",
  "bg-rose-400/20 text-rose-500",
];

export default function FontDisplaySelect() {
  const id = useId();
  const { fontDisplay, onChangeFontDisplay } = useFontDisplay();

  return (
    <div className="*:not-first:mt-2">
      <Select value={fontDisplay} onValueChange={onChangeFontDisplay}>
        <SelectTrigger
          id={id}
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0"
        >
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            <SelectLabel className="ps-2">Impersonate user</SelectLabel>
            {fontsDisplay.map((font, id) => (
              <SelectItem
                key={font.value}
                value={font.value}
                className="flex items-center gap-2"
              >
                <Square className={fontSelectClassName[id]}>
                  {font.label.charAt(0)}
                </Square>
                <span className="truncate">{font.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
