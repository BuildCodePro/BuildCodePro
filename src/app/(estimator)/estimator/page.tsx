import type { Metadata } from "next";

import { RecentProjectsTable, StatsGrid } from "@/components/dashboard";
import {
  EstimatorHeroBanner,
  EstimatorUsageBanner,
} from "@/components/estimator";
import { routes } from "@/config/routes";
import {
  estimatorRecentProjects,
  estimatorStats,
  estimatorUsage,
} from "@/lib/data/estimator";

export const metadata: Metadata = {
  title: "Estimator Dashboard",
  description:
    "BuildCode Pro estimator dashboard — manage fire alarm estimation projects",
};

export default function EstimatorDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <EstimatorHeroBanner />
      <EstimatorUsageBanner usage={estimatorUsage} />
      <StatsGrid stats={estimatorStats} />
      <RecentProjectsTable
        projects={estimatorRecentProjects}
        projectsBasePath={routes.estimator.projects}
      />
    </div>
  );
}
