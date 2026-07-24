import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";
import type { DashboardProject } from "@/types/dashboard";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { formatDate } from "@/lib/utils/format-date";

interface ProjectsListViewProps {
  projects: DashboardProject[];
  className?: string;
  projectsBasePath?: string;
  isLoading?: boolean;
}

export function ProjectsListView({
  projects,
  className,
  projectsBasePath = routes.projects,
  isLoading = false,
}: ProjectsListViewProps) {
  if (isLoading) {
    return <TableSkeleton columns={5} rows={5} className={className} />;
  }

  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Project Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Occupancy Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="text-stat-label">{project.address}</TableCell>
              <TableCell className="text-stat-label">
                {project.occupancyType}
              </TableCell>
              <TableCell>
                <StatusBadge status={project?.display_status} />
              </TableCell>
              <TableCell className="text-stat-label">
                {formatDate(project.lastUpdated)}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`${projectsBasePath}/${project.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-[10px] px-4",
                  )}
                >
                  Open
                  <ArrowRight className="size-3.5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
