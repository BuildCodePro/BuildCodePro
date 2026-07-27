export type ProjectStatus =
  | "completed"
  | "review_needed"
  | "processing"
  | "draft"
  | "exported"
  | "ai_complete"
  | "approved"
  | "ready";

export interface DashboardStat {
  id?: string;
  label: string;
  value: string;
  change?: {
    text: string;
    variant: "success" | "warning" | "neutral";
  };
  progress?: number;
}

export interface DashboardProject {
  id: string;
  name: string;
  address: string;
  occupancyType: string;
  status: ProjectStatus;
  display_status: ProjectStatus;
  workflow_status: ProjectStatus;
  lastUpdated: string;
  createdAt?: string;
  imageUrl?: string;
}

export interface PlanUsage {
  planName: string;
  used: number;
  total: number;
}
