import {
  NUMBER_FORMAT_OPTIONS,
  type NumberFormatId,
} from "~/constants/number-formats";
import { useNumberFormat } from "~/hooks/ui/useNumberFormat";
import { sileo } from "~/lib/toaster";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { NumberFormatBadge } from "./NumberFormatBadge";

export const NumberFormatSelector = () => {
  const { format, setFormat } = useNumberFormat();

  const handleChange = (value: NumberFormatId) => {
    setFormat(value);
    const selected = NUMBER_FORMAT_OPTIONS.find(
      (option) => option.id === value,
    );
    sileo.info({
      title: "Number format updated",
      description: selected?.label ?? value,
    });
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
      <NumberFormatBadge className="self-start sm:self-auto" />
      <Select
        value={format}
        onValueChange={(value) => {
          if (value) handleChange(value as NumberFormatId);
        }}
      >
        <SelectTrigger className="w-full sm:w-72">
          <SelectValue placeholder="Select a format" />
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          align="end"
          className="min-w-[20rem]"
        >
          <SelectGroup>
            <SelectLabel>Number formats</SelectLabel>
            {NUMBER_FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {option.description}
                  </span>
                  <span className="text-muted-foreground/80 font-mono text-[0.7rem]">
                    {option.example}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
