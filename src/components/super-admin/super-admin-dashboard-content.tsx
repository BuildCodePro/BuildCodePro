import { StatsGrid } from "@/components/dashboard/stat-card";
import {
  platformActivity,
  platformCompanies,
  superAdminStats,
} from "@/lib/data/super-admin";

import { PlatformActivityFeed } from "./platform-activity-feed";
import { PlanDistributionPanel } from "./plan-distribution-panel";
import { PlatformHeroBanner } from "./platform-hero-banner";
import { RecentCompaniesTable } from "./companies-table";

export function SuperAdminDashboardContent() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PlatformHeroBanner />
      <StatsGrid stats={superAdminStats} />
      <PlanDistributionPanel />
      <RecentCompaniesTable companies={platformCompanies.slice(0, 5)} />
      <PlatformActivityFeed activities={platformActivity} />
    </div>
  );
}
