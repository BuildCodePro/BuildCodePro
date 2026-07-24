"use client";

import { use } from "react";
import { ProjectDetailsContent } from "@/components/projects/project-details-content";
import { mapProjectDtoToDashboardProject, useGetProjectQuery } from "@/services/projectService";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CompanyProjectDetailsPage({ params }: Props) {
  const { id } = use(params);

  const { data, isLoading } = useGetProjectQuery(id);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <ProjectDetailsContent
      project={mapProjectDtoToDashboardProject(data)}
      backHref="/company/projects"
    />
  );
}