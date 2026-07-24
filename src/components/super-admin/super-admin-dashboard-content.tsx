"use client";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { useAdminDashboardStatsQuery } from "@/services/adminService";
import type { DashboardStat } from "@/types/dashboard";

import { PlatformActivityFeed } from "./platform-activity-feed";
import { PlanDistributionPanel } from "./plan-distribution-panel";
import { PlatformHeroBanner } from "./platform-hero-banner";
import { RecentCompaniesTable } from "./companies-table";

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function buildStats(
  data: ReturnType<typeof useAdminDashboardStatsQuery>["data"],
): DashboardStat[] {
  if (!data) return [];

  return [
    {
      label: "Total Companies",
      value: data.total_companies.total.toLocaleString(),
      change: {
        text: data.total_companies.delta_label,
        variant: data.total_companies.delta >= 0 ? "success" : "warning",
      },
    },
    {
      label: "Active Users",
      value: data.active_users.total.toLocaleString(),
      change: {
        text: data.active_users.delta_label,
        variant: data.active_users.delta >= 0 ? "success" : "warning",
      },
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(data.monthly_revenue_cents.total),
      change: {
        text: data.monthly_revenue_cents.delta_label,
        variant: data.monthly_revenue_cents.delta >= 0 ? "success" : "warning",
      },
    },
    {
      label: "Designs Generated",
      value: data.designs_generated.total.toLocaleString(),
      change: {
        text: data.designs_generated.delta_label,
        variant: data.designs_generated.delta >= 0 ? "success" : "warning",
      },
    },
  ];
}

export function SuperAdminDashboardContent() {
  const dashboardStatsQuery = useAdminDashboardStatsQuery();
  const stats = buildStats(dashboardStatsQuery.data);

  return (
    <div className="flex w-full flex-col gap-6">
      <PlatformHeroBanner />
      <StatsGrid stats={stats} />
      <PlanDistributionPanel />
      <RecentCompaniesTable />
      <PlatformActivityFeed />
    </div>
  );
}