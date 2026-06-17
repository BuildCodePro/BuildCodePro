import type { Metadata } from "next";

import { StatsGrid } from "@/components/dashboard";
import { EngineerHeroBanner, ReviewQueueTable } from "@/components/engineer";
import { routes } from "@/config/routes";
import { engineerStats, reviewQueue } from "@/lib/data/engineer";

export const metadata: Metadata = {
  title: "Engineer Dashboard",
  description:
    "BuildCode Pro PE reviewer dashboard — review AI output and approve designs for permit submission",
};

export default function EngineerDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <EngineerHeroBanner />
      <StatsGrid stats={engineerStats} />
      <ReviewQueueTable
        items={reviewQueue}
        projectsBasePath={routes.engineer.projects}
      />
    </div>
  );
}
