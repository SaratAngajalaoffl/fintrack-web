import { getApiRoute } from "@/configs/api-routes";

/**
 * Absolute URL for `GET /api/auth/me`.
 * When `API_ORIGIN` / `NEXT_PUBLIC_API_ORIGIN` is unset on the server, uses the same origin as
 * `requestUrl` (reverse proxy or Next `/api` → Go rewrite on that host).
 */
export function getAuthMeUrl(requestUrl: string): string {
  const route = getApiRoute("authMe");
  if (route.startsWith("http://") || route.startsWith("https://")) {
    return route;
  }
  return new URL(route, requestUrl).toString();
}

/** Absolute URL for `GET /api/auth/bootstrap-status` (same origin rules as {@link getAuthMeUrl}). */
export function getAuthBootstrapStatusUrl(requestUrl: string): string {
  const route = getApiRoute("authBootstrapStatus");
  if (route.startsWith("http://") || route.startsWith("https://")) {
    return route;
  }
  return new URL(route, requestUrl).toString();
}
