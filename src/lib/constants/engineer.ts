import type { EngineerReviewStatus } from "@/types/engineer";

export const ENGINEER_REVIEW_STATUS_LABELS: Record<
  EngineerReviewStatus,
  string
> = {
  "pending-review": "Pending Review",
  "changes-requested": "Changes Requested",
  approved: "Approved",
  "permit-ready": "Permit Ready",
};

export const ENGINEER_SETTINGS_TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
] as const;

export type EngineerSettingsTabId =
  (typeof ENGINEER_SETTINGS_TABS)[number]["id"];

export const DEFAULT_PERMIT_CHECKLIST = [
  { id: "design-approved", label: "Design approved by licensed PE", completed: false },
  { id: "compliance-verified", label: "NFPA 72 compliance verified", completed: false },
  { id: "bom-reviewed", label: "BOM and material takeoff reviewed", completed: false },
  { id: "narrative-complete", label: "Design narrative complete", completed: false },
  { id: "ahj-notes", label: "AHJ jurisdiction notes documented", completed: false },
  { id: "export-ready", label: "Permit package export ready", completed: false },
] as const;
