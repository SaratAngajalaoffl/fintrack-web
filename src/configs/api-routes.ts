import { API_ORIGIN_LOCAL_DEV_DEFAULT } from "@/configs/api-local-default";

const apiRoutes = {
  authSignup: {
    path: "/api/auth/signup",
  },
  authLogin: {
    path: "/api/auth/login",
  },
  authLogout: {
    path: "/api/auth/logout",
  },
  authMe: {
    path: "/api/auth/me",
  },
  authBootstrapStatus: {
    path: "/api/auth/bootstrap-status",
  },
  authBootstrap: {
    path: "/api/auth/bootstrap",
  },
  authAccountData: {
    path: "/api/auth/account-data",
  },
  authForgotPassword: {
    path: "/api/auth/forgot-password",
  },
  authResetPassword: {
    path: "/api/auth/reset-password",
  },
  authChangePasswordRequestOtp: {
    path: "/api/auth/change-password/request-otp",
  },
  authChangePassword: {
    path: "/api/auth/change-password",
  },
  bankAccounts: {
    path: "/api/bank-accounts",
  },
  bankAccountById: {
    path: "/api/bank-accounts/:accountId",
    create: (params: { accountId: string }) =>
      `/api/bank-accounts/${encodeURIComponent(params.accountId)}`,
  },
  fundBuckets: {
    path: "/api/fund-buckets",
  },
  fundBucketAllocate: {
    path: "/api/fund-buckets/:bucketId/allocate",
    create: (params: { bucketId: string }) =>
      `/api/fund-buckets/${encodeURIComponent(params.bucketId)}/allocate`,
  },
  fundBucketUnlock: {
    path: "/api/fund-buckets/:bucketId/unlock",
    create: (params: { bucketId: string }) =>
      `/api/fund-buckets/${encodeURIComponent(params.bucketId)}/unlock`,
  },
  fundBucketPriority: {
    path: "/api/fund-buckets/:bucketId/priority",
    create: (params: { bucketId: string }) =>
      `/api/fund-buckets/${encodeURIComponent(params.bucketId)}/priority`,
  },
  creditCards: {
    path: "/api/credit-cards",
  },
  creditCardById: {
    path: "/api/credit-cards/:cardId",
    create: (params: { cardId: string }) =>
      `/api/credit-cards/${encodeURIComponent(params.cardId)}`,
  },
  expenseCategories: {
    path: "/api/expense-categories",
  },
  expenseCategoryById: {
    path: "/api/expense-categories/:categoryId",
    create: (params: { categoryId: string }) =>
      `/api/expense-categories/${encodeURIComponent(params.categoryId)}`,
  },
} as const;

type ApiRoutes = typeof apiRoutes;
type ApiRouteKey = keyof ApiRoutes;

type ApiRouteParams<T extends ApiRouteKey> = ApiRoutes[T] extends {
  create: (params: infer P) => string;
}
  ? P
  : never;

type GetApiRouteArgs<T extends ApiRouteKey> =
  ApiRouteParams<T> extends never
    ? []
    : undefined extends ApiRouteParams<T>
      ? [params?: ApiRouteParams<T>]
      : [params: ApiRouteParams<T>];

function resolveApiPath<T extends ApiRouteKey>(
  key: T,
  ...args: GetApiRouteArgs<T>
): string {
  const route = apiRoutes[key] as {
    path: string;
    create?: (params?: unknown) => string;
  };
  if (typeof route.create === "function") {
    return route.create(args[0]);
  }
  return route.path;
}

/**
 * Base URL for the Go HTTP API (no trailing slash).
 *
 * - **Browser:** always `""` so `getApiRoute()` uses same-origin paths (`/api/...`). Session
 *   cookies must be scoped to the Next.js host; credentialed fetches to `NEXT_PUBLIC_API_ORIGIN`
 *   would store `fintrack_session` on the API origin, which middleware and `getSession()` never see.
 * - **Server / Edge middleware:** prefers `API_ORIGIN`, then `NEXT_PUBLIC_API_ORIGIN`, then in
 *   **`NODE_ENV === "development"`** only, {@link API_ORIGIN_LOCAL_DEV_DEFAULT}.
 *
 * **`next.config.ts`** rewrites `/api/*` to the Go API when `API_ORIGIN` or `NEXT_PUBLIC_API_ORIGIN`
 * is set (or the dev default). In Docker, set **`API_ORIGIN=http://api:8000`** (or your service URL)
 * so rewrites from the web container reach the API; the browser still calls `/api/*` on the app host.
 */
export function getApiOrigin(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  const raw = (
    process.env.API_ORIGIN ??
    process.env.NEXT_PUBLIC_API_ORIGIN ??
    ""
  )
    .trim()
    .replace(/\/$/, "");
  let u = raw;
  if (!u && process.env.NODE_ENV === "development") {
    u = API_ORIGIN_LOCAL_DEV_DEFAULT;
  }
  return u;
}

export const getApiRoute = <T extends ApiRouteKey>(
  key: T,
  ...args: GetApiRouteArgs<T>
): string => {
  const path = resolveApiPath(key, ...args);
  const origin = getApiOrigin();
  return origin ? `${origin}${path}` : path;
};

export type { ApiRouteKey };
export default apiRoutes;
