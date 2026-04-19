/**
 * Central place for auth-related path rules. Middleware matcher is broad; keep
 * `AUTH_PAGE_PATHS` aligned with session redirect behavior.
 */

/** URL prefixes that require a valid session cookie (middleware + layouts). */
export const PROTECTED_PREFIXES = ["/dashboard"] as const;

/** Auth UI routes; logged-in users are redirected to the app shell. */
export const AUTH_PAGE_PATHS = [
  "/login",
  "/signup",
  "/setup",
  "/forgot-password",
  "/reset-password",
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function isAuthPagePath(pathname: string): boolean {
  return (AUTH_PAGE_PATHS as readonly string[]).includes(pathname);
}
