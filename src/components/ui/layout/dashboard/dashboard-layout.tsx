import type { ReactNode } from "react";

import { getSession } from "@/lib/auth/session";

import { DashboardSidebar } from "./dashboard-sidebar";

export async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const email = session?.email ?? "";

  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col">
      <DashboardSidebar email={email} />
      <main className="flex flex-1 flex-col py-8 px-(--page-padding-x) md:py-12 md:pr-(--page-padding-x) md:pl-[calc(1rem+16rem+var(--page-padding-x))]">
        <div className="w-full flex-1">{children}</div>
      </main>
    </div>
  );
}
