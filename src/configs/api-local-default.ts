/**
 * When `API_ORIGIN` / `NEXT_PUBLIC_API_ORIGIN` are unset in **development**, server code
 * (middleware, RSC) and `next.config` rewrites assume the Go API runs here — same as
 * **`web/.env.example`**. Override with env for other ports or hosts.
 */
export const API_ORIGIN_LOCAL_DEV_DEFAULT = "http://127.0.0.1:8080";
