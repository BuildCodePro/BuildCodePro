"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { ActivityLogPanel } from "@/components/estimator/activity-log-panel";
import { EngineerReviewPanel } from "@/components/engineer/engineer-review-panel";
import { VersionHistoryPanel } from "@/components/estimator/version-history-panel";
import { ResultsStep } from "@/components/new-design";
import { StatusBadge } from "@/components/ui/badge";
import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { PROJECT_DETAIL_TABS } from "@/lib/constants/project-details";
import {
  getProjectActivityLog,
  getProjectVersionHistory,
  mapProjectToProjectInfo,
} from "@/lib/data/project-details";
import { getEngineerReviewRecord } from "@/lib/data/engineer";
import type { DashboardProject } from "@/types/dashboard";
import type { ProjectDetailTabId } from "@/types/project-details";
import { formatDate } from "@/lib/utils/format-date";

interface ProjectDetailsContentProps {
  project: DashboardProject;
  backHref: string;
  showEngineerReview?: boolean;
}

export function ProjectDetailsContent({
  project,
  backHref,
  showEngineerReview = false,
}: ProjectDetailsContentProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailTabId>("results");
  const projectInfo = mapProjectToProjectInfo(project);
  const versions = getProjectVersionHistory(project.id);
  const activity = getProjectActivityLog(project.id);
  const review = getEngineerReviewRecord(project.id);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-3">
        <Link
          href={backHref}
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
            updated {formatDate(project.lastUpdated)}
          </p>
        </div>
      </div>

      {showEngineerReview ? <EngineerReviewPanel review={review} /> : null}
      <ResultsStep projectInfo={projectInfo} projectId={project.id} />

    </div>
  );
}
