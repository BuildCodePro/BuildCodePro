"use client";

import { use } from "react";
import { ProjectDetailsContent } from "@/components/projects/project-details-content";
import { mapProjectDtoToDashboardProject, useGetProjectQuery } from "@/services/projectService";

interface Props {
  params: Promise<{ id: string; jobId: string }>;
}

export default function JobResultDetailsPage({ params }: Props) {
  const { id, jobId } = use(params);

  const { data, isLoading } = useGetProjectQuery(id);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <ProjectDetailsContent
      project={mapProjectDtoToDashboardProject(data)}
      backHref={`/engineer/projects/${id}/jobs`}
      showEngineerReview
      jobId={jobId}
    />
  );
}
