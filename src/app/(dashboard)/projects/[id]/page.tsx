import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailsContent } from "@/components/projects/project-details-content";
import { routes } from "@/config/routes";
import { getProjectById } from "@/lib/data/project-details";

interface CompanyProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CompanyProjectDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);

  return {
    title: project ? project.name : "Project Details",
    description: "View estimation results, version history, and activity log",
  };
}

export default async function CompanyProjectDetailsPage({
  params,
}: CompanyProjectDetailsPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailsContent
      project={project}
      backHref={routes.projects}
    />
  );
}
