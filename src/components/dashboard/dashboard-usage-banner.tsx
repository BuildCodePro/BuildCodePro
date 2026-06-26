"use client";

import { useRouter } from "next/navigation";

import { PlanUsageBanner } from "@/components/billing/plan-usage-banner";
import { routes } from "@/config/routes";
import { CURRENT_BILLING_USAGE } from "@/lib/constants/billing";

export function DashboardUsageBanner() {
  const router = useRouter();

  return (
    <PlanUsageBanner
      usage={CURRENT_BILLING_USAGE}
      onUpgrade={() => router.push(routes.billing)}
    />
  );
}
