"use client";

import { useMemo, useState } from "react";

import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import {
  PROJECT_DATE_FILTER_OPTIONS,
  PROJECT_JURISDICTION_FILTER_OPTIONS,
  PROJECT_OCCUPANCY_FILTER_OPTIONS,
  PROJECT_STATUS_FILTER_OPTIONS,
  projectsList,
} from "@/lib/data/projects";
import type { DashboardProject } from "@/types/dashboard";

import { ProjectCardGrid } from "./project-card";
import { ProjectsListView } from "./projects-list-view";
import { ViewModeToggle, type ProjectsViewMode } from "./view-mode-toggle";

interface ProjectsContentProps {
  projects?: DashboardProject[];
  projectsBasePath?: string;
}

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function ProjectsContent({
  projects = projectsList,
  projectsBasePath,
}: ProjectsContentProps) {
  const [viewMode, setViewMode] = useState<ProjectsViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [occupancyFilter, setOccupancyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("created");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesOccupancy =
        occupancyFilter === "all" ||
        project.occupancyType === occupancyFilter;
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.address.toLowerCase().includes(query) ||
        project.occupancyType.toLowerCase().includes(query);

      return matchesStatus && matchesOccupancy && matchesSearch;
    });
  }, [occupancyFilter, projects, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <SearchInput
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search projects..."
        aria-label="Search projects"
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={toSelectOptions(PROJECT_STATUS_FILTER_OPTIONS)}
            aria-label="Filter by status"
          />

          <FilterSelect
            value={occupancyFilter}
            onChange={setOccupancyFilter}
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
            onChange={setJurisdictionFilter}
            options={toSelectOptions(PROJECT_JURISDICTION_FILTER_OPTIONS)}
            aria-label="Filter by jurisdiction"
          />
        </div>

        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <ProjectCardGrid
          projects={filteredProjects}
          projectsBasePath={projectsBasePath}
        />
      ) : (
        <ProjectsListView
          projects={filteredProjects}
          projectsBasePath={projectsBasePath}
        />
      )}
    </div>
  );
}
