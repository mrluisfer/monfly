import { fontsDisplay } from "~/constants/fonts-display";
import { useFontDisplay } from "~/hooks/ui/useFontDisplay";

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

const bgColors = [
  "bg-indigo-400/20",
  "bg-purple-400/20",
  "bg-rose-400/20",
  "bg-green-400/20",
  "bg-emerald-400/20",
  "bg-yellow-300/20",
  "bg-blue-400/20",
  "bg-pink-400/20",
  "bg-orange-400/20",
  "bg-cyan-400/20",
  "bg-amber-400/20",
  "bg-lime-400/20",
  "bg-teal-400/20",
  "bg-sky-400/20",
  "bg-violet-400/20",
  "bg-fuchsia-400/20",
];

const textColors = [
  "text-indigo-500",
  "text-purple-500",
  "text-rose-500",
  "text-green-500",
  "text-emerald-500",
  "text-yellow-500",
  "text-blue-500",
  "text-pink-500",
  "text-orange-500",
  "text-cyan-500",
  "text-amber-500",
  "text-lime-500",
  "text-teal-500",
  "text-sky-500",
  "text-violet-500",
  "text-fuchsia-500",
];

function getFontColorClassName(index: number): string {
  const i = index % bgColors.length;
  return `${bgColors[i]} ${textColors[i]}`;
}

export default function FontDisplaySelect() {
  const { fontDisplay, onChangeFontDisplay } = useFontDisplay();

  return (
    <div className="*:not-first:mt-2">
      <Select
        value={fontDisplay}
        onValueChange={(value) => {
          if (value) onChangeFontDisplay(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Font Display</SelectLabel>
            {fontsDisplay.map((font, index) => (
              <SelectItem key={font.value} value={font.value}>
                <Square className={getFontColorClassName(index)}>
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
