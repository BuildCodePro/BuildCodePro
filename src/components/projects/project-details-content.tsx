"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
import { useAnalysisJobsQuery } from "@/services/analysisService";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectDetailsContentProps {
  project: DashboardProject;
  backHref: string;
  showEngineerReview?: boolean;
  jobId?: string;
  /**
   * Base path of the new-design wizard for this role.
   * e.g. "/company/new-design" or "/estimator/new-design"
   */
  newDesignBasePath?: string;
}

export function ProjectDetailsContent({
  project,
  backHref,
  showEngineerReview = false,
  jobId,
  newDesignBasePath = "/company/new-design",
}: ProjectDetailsContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProjectDetailTabId>("results");
  const projectInfo = mapProjectToProjectInfo(project);
  const versions = getProjectVersionHistory(project.id);
  const activity = getProjectActivityLog(project.id);
  const review = getEngineerReviewRecord(project.id);

  // Fetch jobs to see if we need to redirect or show the list
  const { data: jobsData, isLoading: isJobsLoading } = useAnalysisJobsQuery(project.id);

  useEffect(() => {
    // If we finished loading jobs and there are none...
    if (!isJobsLoading && jobsData && jobsData.total === 0) {
      // And the project is not at the results step...
      if (project.current_step && project.current_step !== "results") {
        // Redirect to the wizard at its current step
        const stepMap: Record<string, string> = {
          project_info: "project-info",
          upload_drawing: "upload",
          ai_analysis: "ai-analysis",
        };
        const mappedStep = stepMap[project.current_step] || project.current_step;
        router.replace(`${newDesignBasePath}?projectId=${project.id}&step=${mappedStep}`);
      }
    }
  }, [isJobsLoading, jobsData, project.current_step, project.id, newDesignBasePath, router]);

  if (isJobsLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Hide content entirely if we are about to redirect (no jobs + not results)
  if (jobsData && jobsData.total === 0 && project.current_step && project.current_step !== "results") {
    return null;
  }

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

      <ResultsStep projectInfo={projectInfo} projectId={project.id} jobId={jobId} />

    </div>
  );
}
