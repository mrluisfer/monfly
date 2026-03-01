import { ReactNode, useEffect, useState } from "react";
import { HandIcon, XIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export function WelcomeMessage({ children }: { children: ReactNode }) {
  const [showMsg, setShowMsg] = useState(true);

  const handleDontShowAgain = () => {
    localStorage.setItem("welcomeMsgDismissed", "true");
    setShowMsg(false);
  };

  useEffect(() => {
    const dismissed = localStorage.getItem("welcomeMsgDismissed");
    if (dismissed === "true") {
      setShowMsg(false);
    }
  }, []);

  if (!showMsg) return null;

  return (
    <Alert>
      <HandIcon className="rotate-45 animate-pulse" />
      <AlertTitle>Welcome back!</AlertTitle>
      <AlertDescription>
        {children}
        <div className="flex justify-end flex-1 w-full">
          <Button
            variant="default"
            size="default"
            onClick={handleDontShowAgain}
          >
            <XIcon />
            Don't show again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
