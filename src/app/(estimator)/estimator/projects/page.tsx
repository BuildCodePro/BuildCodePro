import type { Metadata } from "next";

import { EstimatorModuleHeader } from "@/components/estimator";
import { ProjectsContent } from "@/components/projects/projects-content";
import { routes } from "@/config/routes";
import { estimatorProjects } from "@/lib/data/estimator";

export const metadata: Metadata = {
  title: "Projects",
  description: "View and manage your assigned fire alarm estimation projects",
};

export default function EstimatorProjectsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <EstimatorModuleHeader
        title="My Projects"
        description="Search, filter, and open projects — view results, version history, and activity logs per project"
      />
      <ProjectsContent
        projects={estimatorProjects}
        projectsBasePath={routes.estimator.projects}
      />
    </div>
  );
}
