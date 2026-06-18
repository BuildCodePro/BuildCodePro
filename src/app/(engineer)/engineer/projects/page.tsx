import type { Metadata } from "next";

import { EngineerModuleHeader } from "@/components/engineer";
import { ProjectsContent } from "@/components/projects/projects-content";
import { routes } from "@/config/routes";
import { engineerProjects } from "@/lib/data/engineer";

export const metadata: Metadata = {
  title: "Projects",
  description: "Review fire alarm design projects submitted for PE approval",
};

export default function EngineerProjectsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <EngineerModuleHeader
        title="Review Projects"
        description="Search and open projects to review AI output, approve designs, and prepare permit packages"
      />
      <ProjectsContent
        projects={engineerProjects}
        projectsBasePath={routes.engineer.projects}
      />
    </div>
  );
}
