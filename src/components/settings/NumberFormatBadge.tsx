import { NUMBER_FORMAT_OPTIONS } from "~/constants/number-formats";
import { useNumberFormat } from "~/hooks/ui/useNumberFormat";

import { Badge } from "../ui/badge";

type NumberFormatBadgeProps = {
  className?: string;
};

export const NumberFormatBadge = ({ className }: NumberFormatBadgeProps) => {
  const { format } = useNumberFormat();
  const activeOption = NUMBER_FORMAT_OPTIONS.find(
    (option) => option.id === format
  );

  return (
    <Badge
      variant="secondary"
      className={className}
      aria-label={`Active number format: ${activeOption?.label ?? format}`}
    >
      {activeOption?.example ?? format}
    </Badge>
  );
};
