import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routes } from "@/config/routes";
import type { DashboardProject } from "@/types/dashboard";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format-date";
import { TableEmptyState } from "../ui/emptyState";

interface RecentProjectsTableProps {
  projects: DashboardProject[];
  className?: string;
  projectsBasePath?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function RecentProjectsTable({
  projects,
  className,
  projectsBasePath = routes.projects,
  currentPage,
  totalPages,
  onPageChange,
}: RecentProjectsTableProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-section-title">Recent Projects</h2>
        <Link
          href={projectsBasePath}
          className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Project Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Occupancy Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            {/* <TableHead className="text-right">Action</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="p-8">
                <TableEmptyState
                  title="No Projects Found"
                  icon={<Users className="w-8 h-8" />}
                />
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.name}
                </TableCell>

                <TableCell className="text-stat-label">
                  {project.address}
                </TableCell>

                <TableCell className="text-stat-label">
                  {project.occupancyType}
                </TableCell>

                <TableCell>
                  <StatusBadge status={project.display_status || project.workflow_status} />
                </TableCell>

                <TableCell className="text-stat-label">
                  {formatDate(project.lastUpdated)}
                </TableCell>

                {/* <TableCell className="text-right">
                  <Link
                    href={`${projectsBasePath}/${project.id}`}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "sm",
                      }),
                      "h-9 rounded-[10px] px-4"
                    )}
                  >
                    Open
                    <ArrowRight className="size-3.5" />
                  </Link>
                </TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {currentPage && totalPages && onPageChange && totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-5"
        />
      ) : null}
    </section>
  );
}
