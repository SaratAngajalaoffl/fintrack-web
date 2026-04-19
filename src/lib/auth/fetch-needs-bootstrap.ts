import { headers } from "next/headers";

import { getApiRoute } from "@/configs/api-routes";

/**
 * Server-only: asks the Go API whether the database has zero users (initial setup required).
 */
export async function fetchNeedsBootstrap(): Promise<boolean> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) {
    return false;
  }
  const route = getApiRoute("authBootstrapStatus");
  const url =
    route.startsWith("http://") || route.startsWith("https://")
      ? route
      : `${proto}://${host}${route}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return false;
    }
    const data = (await res.json()) as { needsBootstrap?: boolean };
    return data.needsBootstrap === true;
  } catch {
    return false;
  }
}
