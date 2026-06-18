"use client";

import { routes } from "@/config/routes";
import type { DashboardProject } from "@/types/dashboard";

import { ProjectDetailsContent } from "@/components/projects/project-details-content";

interface EstimatorProjectDetailsContentProps {
  project: DashboardProject;
}

export function EstimatorProjectDetailsContent({
  project,
}: EstimatorProjectDetailsContentProps) {
  return (
    <ProjectDetailsContent
      project={project}
      backHref={routes.estimator.projects}
    />
  );
}
