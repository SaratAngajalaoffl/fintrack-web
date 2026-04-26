const appRoutes = {
  home: {
    path: "/",
  },
  login: {
    path: "/login",
  },
  signup: {
    path: "/signup",
  },
  setup: {
    path: "/setup",
  },
  forgotPassword: {
    path: "/forgot-password",
  },
  resetPassword: {
    path: "/reset-password",
  },
  dashboard: {
    path: "/dashboard",
  },
  dashboardAccountSettings: {
    path: "/dashboard/account-settings",
  },
  dashboardChangePassword: {
    path: "/dashboard/change-password",
  },
  dashboardBankAccounts: {
    path: "/dashboard/bank-accounts/my-bank-accounts",
  },
  dashboardBankStatements: {
    path: "/dashboard/bank-accounts/statements",
  },
  dashboardCreditCards: {
    path: "/dashboard/credit-cards/my-credit-cards",
  },
  dashboardCreditCardBills: {
    path: "/dashboard/credit-cards/bills",
  },
  dashboardExpenses: {
    path: "/dashboard/expenses/my-expenses",
  },
  dashboardExpenseEmis: {
    path: "/dashboard/expenses/emis",
  },
  dashboardExpenseLoans: {
    path: "/dashboard/expenses/loans",
  },
  dashboardIncome: {
    path: "/dashboard/receivables/income",
  },
  dashboardLending: {
    path: "/dashboard/receivables/lending",
  },
  dashboardTransactionsInternal: {
    path: "/dashboard/transactions/internal",
  },
  dashboardTransactionsCredits: {
    path: "/dashboard/transactions/credits",
  },
  dashboardTransactionsDebits: {
    path: "/dashboard/transactions/debits",
  },
  dashboardExpenseCategories: {
    path: "/dashboard/organisation/expense-categories",
  },
  dashboardFundBuckets: {
    path: "/dashboard/organisation/fund-buckets",
  },
  dashboardExpenseGroups: {
    path: "/dashboard/organisation/expense-groups",
  },
} as const;

type AppRoutes = typeof appRoutes;
type AppRouteKey = keyof AppRoutes;

type AppRouteParams<T extends AppRouteKey> = AppRoutes[T] extends {
  create: (params: infer P) => string;
}
  ? P
  : never;

type GetAppRouteArgs<T extends AppRouteKey> =
  AppRouteParams<T> extends never
    ? []
    : undefined extends AppRouteParams<T>
      ? [params?: AppRouteParams<T>]
      : [params: AppRouteParams<T>];

function resolveAppPath<T extends AppRouteKey>(
  key: T,
  ...args: GetAppRouteArgs<T>
): string {
  const route = appRoutes[key] as {
    path: string;
    create?: (params?: unknown) => string;
  };
  if (typeof route.create === "function") {
    return route.create(args[0]);
  }
  return route.path;
}

export const getAppRoute = <T extends AppRouteKey>(
  key: T,
  ...args: GetAppRouteArgs<T>
): string => resolveAppPath(key, ...args);

export type { AppRouteKey };
export default appRoutes;
