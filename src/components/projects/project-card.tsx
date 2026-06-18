import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StatusBadge } from "@/components/ui/badge";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";
import type { DashboardProject } from "@/types/dashboard";

const PROJECT_IMAGE_FALLBACK = "/images/brand-panel.png";

interface ProjectCardProps {
  project: DashboardProject;
  className?: string;
  projectsBasePath?: string;
}

export function ProjectCard({
  project,
  className,
  projectsBasePath = routes.projects,
}: ProjectCardProps) {
  const displayDate = project.createdAt ?? project.lastUpdated;

  return (
    <article
      className={cn(
        "flex h-[236px] w-full max-w-[344px] flex-col justify-between overflow-hidden rounded-[16px] border border-border bg-white pb-[10px] lg:max-w-none",
        className,
      )}
    >
      <div className="min-h-0">
        <div className="relative h-[110px] w-full overflow-hidden bg-slate-200">
          <Image
            src={project.imageUrl ?? PROJECT_IMAGE_FALLBACK}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 344px"
          />
          <StatusBadge
            status={project.status}
            className="absolute top-2.5 right-2.5 shadow-sm"
          />
        </div>

        <div className="space-y-1 px-4 pt-3">
          <h3 className="truncate font-body text-sm font-semibold text-foreground">
            {project.name}
          </h3>
          <p className="truncate font-body text-xs text-stat-label">
            {project.address}
          </p>
          <p className="truncate font-body text-xs text-stat-label">
            {project.occupancyType} • {displayDate}
          </p>
        </div>
      </div>

      <div className="px-4">
        <Link
          href={`${projectsBasePath}/${project.id}`}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] border border-border bg-surface font-body text-sm font-medium text-foreground transition-colors hover:bg-slate-100"
        >
          Open Project
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

interface ProjectCardGridProps {
  projects: DashboardProject[];
  className?: string;
  projectsBasePath?: string;
}

export function ProjectCardGrid({
  projects,
  className,
  projectsBasePath,
}: ProjectCardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:justify-items-stretch",
        className,
      )}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          projectsBasePath={projectsBasePath}
        />
      ))}
    </div>
  );
}
