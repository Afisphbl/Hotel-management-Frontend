export function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  const appDomain: string | undefined = (import.meta as any).env?.VITE_APP_DOMAIN;
  if (!appDomain) return null;

  const domainParts = appDomain.split(":");
  const baseDomain = domainParts[0];
  const parts = hostname.split(".");

  if (hostname === baseDomain || hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
  }
  if (parts.length >= 2 && parts[parts.length - 1] === baseDomain) {
    return parts.slice(0, -1).join(".");
  }
  // Fallback for localhost dev
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    return parts[0];
  }
  return null;
}
