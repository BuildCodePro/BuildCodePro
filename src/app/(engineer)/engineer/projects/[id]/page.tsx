import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EngineerProjectDetailsContent } from "@/components/engineer";
import { getEngineerProjectById } from "@/lib/data/engineer";

interface EngineerProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EngineerProjectDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getEngineerProjectById(id);

  return {
    title: project ? `${project.name} — Review` : "Project Review",
    description:
      "Review AI design output, approve for permit submission, and view project history",
  };
}

export default async function EngineerProjectDetailsPage({
  params,
}: EngineerProjectDetailsPageProps) {
  const { id } = await params;
  const project = getEngineerProjectById(id);

  if (!project) {
    notFound();
  }

  return <EngineerProjectDetailsContent project={project} />;
}
