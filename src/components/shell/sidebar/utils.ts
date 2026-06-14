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
