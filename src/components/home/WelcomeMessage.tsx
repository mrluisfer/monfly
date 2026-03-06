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
    <Alert className="app-panel rounded-2xl border-border/70 p-3">
      <HandIcon className="rotate-45" />
      <AlertTitle className="font-[family-name:var(--font-syne)]">
        Welcome back!
      </AlertTitle>
      <AlertDescription>
        {children}
        <div className="flex justify-end flex-1 w-full">
          <Button
            variant="default"
            size="default"
            onClick={handleDontShowAgain}
            className="rounded-full"
          >
            <XIcon />
            Hide
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
