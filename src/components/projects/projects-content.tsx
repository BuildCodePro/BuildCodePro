"use client";

import { useState } from "react";
import { Loader2, Rocket } from "lucide-react";

import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetProjectsQuery } from "@/services/projectService";
import {
  PROJECT_DATE_FILTER_OPTIONS,
  PROJECT_JURISDICTION_FILTER_OPTIONS,
  PROJECT_OCCUPANCY_FILTER_OPTIONS,
  PROJECT_STATUS_FILTER_OPTIONS,
} from "@/lib/data/projects";
import type { DashboardProject } from "@/types/dashboard";

import { ProjectCardGrid } from "./project-card";
import { ProjectsListView } from "./projects-list-view";
import { ViewModeToggle, type ProjectsViewMode } from "./view-mode-toggle";
import { TableEmptyState } from "../ui/emptyState";

interface ProjectsContentProps {
  projectsBasePath?: string;
  // Fallback prop in case it's used elsewhere with static data
  projects?: any[];
}

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function ProjectsContent({ projectsBasePath }: ProjectsContentProps) {
  const [viewMode, setViewMode] = useState<ProjectsViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [occupancyFilter, setOccupancyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("created");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useGetProjectsQuery({
    page,
    page_size: pageSize,
    search: debouncedSearchQuery,
    status: statusFilter,
    occupancy_type: occupancyFilter,
    jurisdiction_state: jurisdictionFilter,
  });

  // Map API response to UI expected format (DashboardProject)
  const displayProjects: DashboardProject[] = (data?.items || []).map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    jurisdiction: p.jurisdiction,
    occupancyType: p.occupancy_type,
    display_status: p.display_status,
    workflow_status: p.workflow_status,
    status: p.status as any,
    dateCreated: p.created_at,
    lastUpdated: p.updated_at,
    squareFootage: p.square_footage,
    current_step: p.current_step,
  }));

  const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;
  return (
    <div className="space-y-6">
      <SearchInput
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setPage(1);
        }}
        placeholder="Search projects..."
        aria-label="Search projects"
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            options={toSelectOptions(PROJECT_STATUS_FILTER_OPTIONS)}
            aria-label="Filter by status"
          />

          <FilterSelect
            value={occupancyFilter}
            onChange={(val) => { setOccupancyFilter(val); setPage(1); }}
            options={toSelectOptions(PROJECT_OCCUPANCY_FILTER_OPTIONS)}
            aria-label="Filter by occupancy"
          />

          <FilterSelect
            value={dateFilter}
            onChange={setDateFilter}
            options={toSelectOptions(PROJECT_DATE_FILTER_OPTIONS)}
            aria-label="Sort by date"
          />

          <FilterSelect
            value={jurisdictionFilter}
            onChange={(val) => { setJurisdictionFilter(val); setPage(1); }}
            options={toSelectOptions(PROJECT_JURISDICTION_FILTER_OPTIONS)}
            aria-label="Filter by jurisdiction"
          />
        </div>

        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </div>

      {isError ? (
        <div className="flex h-64 items-center justify-center text-destructive">
          Error loading projects.
        </div>
      ) : displayProjects.length === 0 && !isLoading ? (
        <div className="flex h-64 items-center justify-center text-stat-label w-full">
          <TableEmptyState
            icon={<Rocket className="h-8 w-8" />}
            title="No Projects found"
          // description="No Projects found Create"
          />
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <ProjectCardGrid
              projects={displayProjects}
              projectsBasePath={projectsBasePath}
              isLoading={isLoading}
            />
          ) : (
            <ProjectsListView
              projects={displayProjects}
              projectsBasePath={projectsBasePath}
              isLoading={isLoading}
            />
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-6"
          />
        </>
      )}
    </div>
  );
}
