// import type { Metadata } from "next";
// import { notFound } from "next/navigation";

// import { EstimatorProjectDetailsContent } from "@/components/estimator";
// import { getEstimatorProjectById } from "@/lib/data/estimator";

// interface EstimatorProjectDetailsPageProps {
//   params: Promise<{ id: string }>;
// }

// export async function generateMetadata({
//   params,
// }: EstimatorProjectDetailsPageProps): Promise<Metadata> {
//   const { id } = await params;
//   const project = getEstimatorProjectById(id);

//   return {
//     title: project ? project.name : "Project Details",
//     description: "View estimation results, version history, and activity log",
//   };
// }

// export default async function EstimatorProjectDetailsPage({
//   params,
// }: EstimatorProjectDetailsPageProps) {
//   const { id } = await params;
//   const project = getEstimatorProjectById(id);

//   if (!project) {
//     notFound();
//   }

//   return <EstimatorProjectDetailsContent project={project} />;
// }

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
