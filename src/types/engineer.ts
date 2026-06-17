export type EngineerReviewStatus =
  | "pending-review"
  | "changes-requested"
  | "approved"
  | "permit-ready";

export interface ReviewQueueItem {
  id: string;
  projectName: string;
  address: string;
  submittedBy: string;
  submittedAt: string;
  complianceScore: number;
  reviewFlags: number;
  reviewStatus: EngineerReviewStatus;
}

export interface PermitChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface EngineerReviewRecord {
  projectId: string;
  status: EngineerReviewStatus;
  reviewedBy: string;
  reviewedAt: string;
  engineerNotes: string;
  permitChecklist: PermitChecklistItem[];
}
