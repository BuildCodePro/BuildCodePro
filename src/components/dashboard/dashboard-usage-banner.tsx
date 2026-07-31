"use client";

import { useRouter } from "next/navigation";

import { PlanUsageBanner } from "@/components/billing/plan-usage-banner";
import { routes } from "@/config/routes";
import { CURRENT_BILLING_USAGE } from "@/lib/constants/billing";

interface DashboardUsageBannerProps {
  usage?: {
    used: number;
    limit: number;
    plan_name: string;
  };
}

export function DashboardUsageBanner({ usage }: DashboardUsageBannerProps) {
  const router = useRouter();
  const displayUsage = usage
    ? {
      ...CURRENT_BILLING_USAGE,
      planName: usage.plan_name,
      used: usage.used,
      total: usage.limit,
      designsLabel: `${usage.limit} designs / month`,
    }
    : CURRENT_BILLING_USAGE;

  return (
    <PlanUsageBanner
      usage={displayUsage}
      onUpgrade={() => router.push(routes.billing)}
    />
  );
}
