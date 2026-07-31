"use client";

import { useRouter } from "next/navigation";

import { PlanUsageBanner } from "@/components/billing/plan-usage-banner";
import { routes } from "@/config/routes";
import { useAuthStore } from "@/store/auth-store";

interface DashboardUsageBannerProps {
  usage?: {
    used: number;
    limit: number;
    plan_name: string;
  };
}

export function DashboardUsageBanner({ usage }: DashboardUsageBannerProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  if (user?.plan?.code === "enterprise") {
    return null;
  }

  const plan = user?.plan;
  const planName = plan?.name || "Enterprise";
  const priceLabel = plan ? `$${plan.amount_cents / 100} / month` : "$599 / month";
  const limit = plan ? plan.monthly_design_limit : null;
  const designsLabel = limit === null ? "unlimited designs / month" : `${limit} designs / month`;

  const displayUsage = {
    planName,
    priceLabel,
    designsLabel,
    used: usage?.used || 0,
    total: limit || 0,
  };

  return (
    <PlanUsageBanner
      usage={displayUsage}
      onUpgrade={() => router.push(routes.billing)}
    />
  );
}
