export type ProjectDetailTabId = "results" | "history" | "activity";

export interface ProjectVersion {
  id: string;
  version: string;
  label: string;
  createdAt: string;
  createdBy: string;
  changes: string;
}

export interface ProjectActivityEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface EstimatorUsage {
  used: number;
  total: number;
  planName: string;
}
