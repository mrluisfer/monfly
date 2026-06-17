export function resolveRoutePath(url: string, params?: Record<string, string>) {
  if (!params) return url;
  return url.replace(/\$(\w+)/g, (_, key: string) => params[key] ?? `$${key}`);
}

export function isRouteActive(
  currentPath: string,
  url: string,
  params?: Record<string, string>,
) {
  const resolved = resolveRoutePath(url, params);
  if (resolved === "/home") return currentPath === "/home";
  return currentPath === resolved || currentPath.startsWith(`${resolved}/`);
}

/**
 * Picks the single best-matching path for the current location among a set of
 * candidates — the longest one that matches wins. This keeps only the most
 * specific item highlighted when routes are nested (e.g. on
 * `/user/settings/change-password`, "Change password" lights up, not its
 * "Settings" ancestor).
 */
export function getActivePath(
  currentPath: string,
  candidatePaths: string[],
): string | null {
  let best: string | null = null;
  for (const path of candidatePaths) {
    const matches =
      path === "/home"
        ? currentPath === "/home"
        : currentPath === path || currentPath.startsWith(`${path}/`);
    if (matches && (best === null || path.length > best.length)) {
      best = path;
    }
  }
  return best;
}
