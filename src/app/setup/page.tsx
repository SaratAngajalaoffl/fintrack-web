import { redirect } from "next/navigation";

import { AuthPageLayout } from "@/components/ui/layout";
import { InitialSetupForm } from "@/components/ui/forms/initial-setup-form";
import { getAppRoute } from "@/configs/app-routes";
import { fetchNeedsBootstrap } from "@/lib/auth/fetch-needs-bootstrap";

export const metadata = {
  title: "Initial setup — Fintrack",
};

export default async function SetupPage() {
  const needsBootstrap = await fetchNeedsBootstrap();
  if (!needsBootstrap) {
    redirect(getAppRoute("home"));
  }

  return (
    <AuthPageLayout>
      <InitialSetupForm />
    </AuthPageLayout>
  );
}
