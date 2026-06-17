import type { DashboardProject, DashboardStat } from "@/types/dashboard";
import type { EstimatorUsage } from "@/types/estimator";

import {
  getProjectActivityLog,
  getProjectVersionHistory,
  mapProjectToProjectInfo,
} from "@/lib/data/project-details";
import { projectsList } from "./projects";

export const estimatorUsage: EstimatorUsage = {
  planName: "Professional Plan",
  used: 14,
  total: 25,
};

export const estimatorStats: DashboardStat[] = [
  {
    id: "active-estimates",
    label: "Active Estimates",
    value: "8",
    change: { text: "3 in analysis", variant: "neutral" },
  },
  {
    id: "boms-ready",
    label: "BOMs Ready",
    value: "5",
    change: { text: "↑ 2 this week", variant: "success" },
  },
  {
    id: "compliance-flags",
    label: "Compliance Flags",
    value: "4",
    change: { text: "⚠ Review required", variant: "warning" },
  },
  {
    id: "exports-week",
    label: "Exports This Week",
    value: "7",
    change: { text: "↑ 3 bid-ready", variant: "success" },
  },
];

export const estimatorProjects: DashboardProject[] = projectsList.slice(0, 5);

export const estimatorRecentProjects: DashboardProject[] =
  estimatorProjects.slice(0, 5);

export function getEstimatorProjectById(
  id: string,
): DashboardProject | undefined {
  return estimatorProjects.find((project) => project.id === id);
}

export {
  getProjectActivityLog,
  getProjectVersionHistory,
  mapProjectToProjectInfo,
};
