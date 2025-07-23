import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

import { Badge } from "@/components/ui/badge";

export function OnlineStatusBadge() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? window.navigator.onLine : true
  );

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Badge variant="secondary" className="gap-1.5 select-none">
      <span
        className={cn(
          "size-1.5 rounded-full",
          isOnline ? "bg-emerald-500" : "bg-zinc-400"
        )}
        aria-hidden="true"
      ></span>
      User {isOnline ? "Online" : "Offline"}
    </Badge>
  );
}
