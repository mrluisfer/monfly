import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ZapIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const TimezoneBadge = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Example: "Jul 5, 2025 - 13:04:59"
  const formatted = format(now, "PPpp"); // "yyyy-MM-dd HH:mm:ss"

  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 text-secondary-foreground"
    >
      <ZapIcon className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
      <span className="ml-1">{formatted}</span>
    </Badge>
  );
};
