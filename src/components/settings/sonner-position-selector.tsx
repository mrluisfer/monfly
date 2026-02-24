import { sonnerPositions } from "~/constants/sonner-positions";
import { useSonnerPosition } from "~/hooks/use-sonner-position";
import { sileo } from "~/lib/toaster";
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

export const SonnerPositionSelector = () => {
  const { position, setPosition } = useSonnerPosition();

  const handlePositionChange = (value: SonnerPosition) => {
    setPosition(value);
    sileo.info({
      title: "Notification position updated",
      description: value,
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Select value={position} onValueChange={handlePositionChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a position" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Positions</SelectLabel>
            {sonnerPositions.map((position) => (
              <SelectItem key={position.value} value={position.value}>
                {position.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
