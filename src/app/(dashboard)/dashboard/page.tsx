import type { Metadata } from "next";

import {
  DashboardUsageBanner,
  HeroBanner,
  RecentProjectsTable,
  StatsGrid,
} from "@/components/dashboard";
import { dashboardStats, recentProjects } from "@/lib/data/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "BuildCode Pro dashboard — manage fire alarm estimation projects",
};

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <HeroBanner />
      <DashboardUsageBanner />
      <StatsGrid stats={dashboardStats} />
      <RecentProjectsTable projects={recentProjects} />
    </div>
  );
}
