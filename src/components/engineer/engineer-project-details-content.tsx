"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { ActivityLogPanel } from "@/components/estimator/activity-log-panel";
import { VersionHistoryPanel } from "@/components/estimator/version-history-panel";
import { ResultsStep } from "@/components/new-design";
import { StatusBadge } from "@/components/ui/badge";
import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { routes } from "@/config/routes";
import { PROJECT_DETAIL_TABS } from "@/lib/constants/project-details";
import {
  getEngineerReviewRecord,
  getProjectActivityLog,
  getProjectVersionHistory,
  mapProjectToProjectInfo,
} from "@/lib/data/engineer";
import type { ProjectDetailTabId } from "@/types/project-details";
import type { DashboardProject } from "@/types/dashboard";

import { EngineerReviewPanel } from "./engineer-review-panel";

interface EngineerProjectDetailsContentProps {
  project: DashboardProject;
}

export function EngineerProjectDetailsContent({
  project,
}: EngineerProjectDetailsContentProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailTabId>("results");
  const projectInfo = mapProjectToProjectInfo(project);
  const review = getEngineerReviewRecord(project.id);
  const versions = getProjectVersionHistory(project.id);
  const activity = getProjectActivityLog(project.id);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-3">
        <Link
          href={routes.engineer.projects}
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-section-title">{project.name}</h2>
            <StatusBadge status={project.status} />
          </div>
          <p className="font-body text-sm text-stat-label">
            {project.address} &bull; {project.occupancyType} &bull; Last
            updated {project.lastUpdated}
          </p>
        </div>
      </div>

      <EngineerReviewPanel review={review} />

      <UnderlineTabs
        tabs={[...PROJECT_DETAIL_TABS]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aria-label="Project review sections"
      />

      <TabPanel
        id={`tabpanel-${activeTab}`}
        labelledBy={`tab-${activeTab}`}
      >
        {activeTab === "results" ? (
          <ResultsStep projectInfo={projectInfo} />
        ) : null}
        {activeTab === "history" ? (
          <VersionHistoryPanel versions={versions} />
        ) : null}
        {activeTab === "activity" ? (
          <ActivityLogPanel entries={activity} />
        ) : null}
      </TabPanel>
    </div>
  );
}
