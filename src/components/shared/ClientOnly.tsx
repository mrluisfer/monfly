import type { ReactNode } from "react";

import { useIsMounted } from "~/hooks/ui/useIsMounted";

type ClientOnlyProps = {
  children: ReactNode;
  /** Rendered on the server and during the first client render. */
  fallback?: ReactNode;
};

/**
 * Renders `children` only after the component has mounted on the client.
 *
 * Use this to wrap browser-only subtrees (e.g. recharts visualizations) that
 * crash or mismatch during server-side rendering. The server and the initial
 * client render both show `fallback`, so hydration stays consistent.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  return useIsMounted() ? <>{children}</> : <>{fallback}</>;
}
