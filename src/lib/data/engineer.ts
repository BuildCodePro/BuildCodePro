import type { DashboardProject, DashboardStat } from "@/types/dashboard";
import type {
  EngineerReviewRecord,
  EngineerReviewStatus,
  ReviewQueueItem,
} from "@/types/engineer";
import type { ProjectActivityEntry, ProjectVersion } from "@/types/estimator";
import type { ProjectInfoFormData } from "@/types/new-design";

import { DEFAULT_PERMIT_CHECKLIST } from "@/lib/constants/engineer";
import { projectsList } from "./projects";

export const engineerStats: DashboardStat[] = [
  {
    id: "pending-review",
    label: "Pending Review",
    value: "4",
    change: { text: "⚠ Awaiting PE sign-off", variant: "warning" },
  },
  {
    id: "approved-week",
    label: "Approved This Week",
    value: "6",
    change: { text: "↑ 2 from last week", variant: "success" },
  },
  {
    id: "compliance-flags",
    label: "Compliance Flags",
    value: "11",
    change: { text: "Across active reviews", variant: "neutral" },
  },
  {
    id: "permit-ready",
    label: "Permit Ready",
    value: "3",
    change: { text: "Ready for submission", variant: "success" },
  },
];

export const reviewQueue: ReviewQueueItem[] = [
  {
    id: "2",
    projectName: "Greenfield Office Tower",
    address: "880 Market St, CA",
    submittedBy: "Sarah Chen",
    submittedAt: "Jun 8, 2025",
    complianceScore: 78,
    reviewFlags: 7,
    reviewStatus: "pending-review",
  },
  {
    id: "4",
    projectName: "Eastside High School",
    address: "400 Campus Rd, OH",
    submittedBy: "Sarah Chen",
    submittedAt: "Jun 6, 2025",
    complianceScore: 62,
    reviewFlags: 11,
    reviewStatus: "pending-review",
  },
  {
    id: "3",
    projectName: "Harbor View Apartments",
    address: "12 Bayfront Dr, FL",
    submittedBy: "Sarah Chen",
    submittedAt: "Jun 7, 2025",
    complianceScore: 85,
    reviewFlags: 4,
    reviewStatus: "changes-requested",
  },
  {
    id: "1",
    projectName: "Riverside Mall — Bldg A",
    address: "245 Commerce Blvd, TX",
    submittedBy: "Sarah Chen",
    submittedAt: "Jun 9, 2025",
    complianceScore: 91,
    reviewFlags: 3,
    reviewStatus: "approved",
  },
  {
    id: "5",
    projectName: "Metro Logistics Hub",
    address: "19 Industrial Pkwy, NJ",
    submittedBy: "Sarah Chen",
    submittedAt: "Jun 5, 2025",
    complianceScore: 88,
    reviewFlags: 4,
    reviewStatus: "permit-ready",
  },
];

/** Projects assigned to engineer for review */
export const engineerProjects: DashboardProject[] = projectsList.filter(
  (project) =>
    project.status === "review-needed" ||
    project.status === "completed" ||
    project.status === "exported",
);

const REVIEW_STATUS_BY_PROJECT: Record<string, EngineerReviewStatus> = {
  "1": "approved",
  "2": "pending-review",
  "3": "changes-requested",
  "4": "pending-review",
  "5": "permit-ready",
};

const DEFAULT_VERSION_HISTORY: ProjectVersion[] = [
  {
    id: "v3",
    version: "v3",
    label: "Submitted for PE review",
    createdAt: "Jun 9, 2025 · 2:14 PM",
    createdBy: "Sarah Chen",
    changes: "Estimator submitted for licensed engineer review",
  },
  {
    id: "v2",
    version: "v2",
    label: "Compliance re-run after jurisdiction update",
    createdAt: "Jun 8, 2025 · 4:42 PM",
    createdBy: "Sarah Chen",
    changes: "NFPA 72 2022 compliance checklist regenerated",
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
    id: "a6",
    action: "PE Review",
    description: "Submitted to licensed engineer for final approval",
    timestamp: "Jun 9, 2025 · 2:14 PM",
    actor: "Sarah Chen",
  },
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
];

export function getEngineerProjectById(
  id: string,
): DashboardProject | undefined {
  return engineerProjects.find((project) => project.id === id);
}

export function getReviewStatusForProject(
  projectId: string,
): EngineerReviewStatus {
  return REVIEW_STATUS_BY_PROJECT[projectId] ?? "pending-review";
}

export function getEngineerReviewRecord(
  projectId: string,
): EngineerReviewRecord {
  const status = getReviewStatusForProject(projectId);

  return {
    projectId,
    status,
    reviewedBy: status === "pending-review" ? "" : "Mike Rodriguez, PE",
    reviewedAt:
      status === "pending-review" ? "" : "Jun 9, 2025 · 4:30 PM",
    engineerNotes:
      status === "changes-requested"
        ? "Verify horn/strobe coverage in east corridor — spacing exception flagged by AI."
        : "",
    permitChecklist: DEFAULT_PERMIT_CHECKLIST.map((item) => ({
      ...item,
      completed:
        status === "permit-ready" ||
        (status === "approved" &&
          ["design-approved", "compliance-verified", "bom-reviewed"].includes(
            item.id,
          )),
    })),
  };
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
