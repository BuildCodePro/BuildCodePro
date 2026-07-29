"use client";

import { use } from "react";
import { ProjectDetailsContent } from "@/components/projects/project-details-content";
import { mapProjectDtoToDashboardProject, useGetProjectQuery } from "@/services/projectService";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EstimatorProjectDetailsPage({ params }: Props) {
  const { id } = use(params);

  const { data, isLoading } = useGetProjectQuery(id);

  if (isLoading || !data) {
    return <div>      <TableSkeleton rows={10} columns={2} />
    </div>;
  }

  return (
    <ProjectDetailsContent
      project={mapProjectDtoToDashboardProject(data)}
      backHref="/estimator/projects"
    />
  );
}
