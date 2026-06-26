import type { DashboardProject } from "@/types/dashboard";
import type { ProjectActivityEntry, ProjectVersion } from "@/types/estimator";
import type { ProjectInfoFormData } from "@/types/new-design";

import { projectsList } from "./projects";

const DEFAULT_VERSION_HISTORY: ProjectVersion[] = [
  {
    id: "v3",
    version: "v3",
    label: "Compliance re-run after jurisdiction update",
    createdAt: "Jun 9, 2025 · 2:14 PM",
    createdBy: "Sarah Chen",
    changes: "NFPA 72 2022 compliance checklist regenerated",
  },
  {
    id: "v2",
    version: "v2",
    label: "BOM updated with revised device counts",
    createdAt: "Jun 8, 2025 · 4:42 PM",
    createdBy: "Sarah Chen",
    changes: "12 device quantity adjustments, wiring recalculated",
  },
  {
    id: "v1",
    version: "v1",
    label: "Initial AI design generation",
    createdAt: "Jun 7, 2025 · 10:08 AM",
    createdBy: "Sarah Chen",
    changes: "First analysis from uploaded floor plans",
  },
];

const DEFAULT_ACTIVITY_LOG: ProjectActivityEntry[] = [
  {
    id: "a5",
    action: "Export",
    description: "PDF report exported for bid submission",
    timestamp: "Jun 9, 2025 · 3:30 PM",
    actor: "Sarah Chen",
  },
  {
    id: "a4",
    action: "Compliance",
    description: "Compliance checklist re-generated (91% pass rate)",
    timestamp: "Jun 9, 2025 · 2:14 PM",
    actor: "Sarah Chen",
  },
  {
    id: "a3",
    action: "BOM Update",
    description: "Material takeoff revised — 12 line items changed",
    timestamp: "Jun 8, 2025 · 4:42 PM",
    actor: "Sarah Chen",
  },
  {
    id: "a2",
    action: "AI Analysis",
    description: "Design recommendations generated from floor plans",
    timestamp: "Jun 7, 2025 · 10:08 AM",
    actor: "Sarah Chen",
  },
  {
    id: "a1",
    action: "Project Created",
    description: "Project metadata and drawings uploaded",
    timestamp: "Jun 7, 2025 · 9:45 AM",
    actor: "Sarah Chen",
  },
];

export function getProjectById(id: string): DashboardProject | undefined {
  return projectsList.find((project) => project.id === id);
}

export function getProjectVersionHistory(
  _projectId: string,
): ProjectVersion[] {
  return DEFAULT_VERSION_HISTORY;
}

export function getProjectActivityLog(
  _projectId: string,
): ProjectActivityEntry[] {
  return DEFAULT_ACTIVITY_LOG;
}

export function mapProjectToProjectInfo(
  project: DashboardProject,
): ProjectInfoFormData {
  return {
    projectName: project.name,
    address: project.address,
    jurisdiction: "Austin, TX — Travis County",
    squareFootage: "45,000",
    numberOfFloors: "3",
    occupancyType: project.occupancyType,
    optionalSystems: {
      sprinkler: true,
      elevator: true,
      ductDetectors: false,
      voiceEvacuation: false,
    },
    specialNotes: "",
  };
}
