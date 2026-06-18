import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EstimatorProjectDetailsContent } from "@/components/estimator";
import { getEstimatorProjectById } from "@/lib/data/estimator";

interface EstimatorProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EstimatorProjectDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getEstimatorProjectById(id);

  return {
    title: project ? project.name : "Project Details",
    description: "View estimation results, version history, and activity log",
  };
}

export default async function EstimatorProjectDetailsPage({
  params,
}: EstimatorProjectDetailsPageProps) {
  const { id } = await params;
  const project = getEstimatorProjectById(id);

  if (!project) {
    notFound();
  }

  return <EstimatorProjectDetailsContent project={project} />;
}
