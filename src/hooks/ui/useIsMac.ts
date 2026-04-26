import { useEffect, useState } from "react";

/**
 * Detects whether the current platform is Apple-based (Mac/iOS).
 * Returns false on the server and on first render to keep markup stable,
 * then updates on the client after hydration.
 */
export function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform ?? navigator.platform ?? "";
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(platform));
  }, []);

  return isMac;
}
