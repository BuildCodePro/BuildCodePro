export type ProjectStatus =
  | "completed"
  | "complete"
  | "review_needed"
  | "processing"
  | "draft"
  | "exported"
  | "ai_complete"
  | "approved"
  | "change_request"
  | "under_review"
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
  jurisdiction?: string;
  ibc_edition?: string | null;
  ifc_edition?: string | null;
  nfpa72_edition?: string | null;
  square_footage?: number;
  number_of_floors?: number;
  sprinkler_system?: boolean;
  elevator?: boolean;
  duct_detectors?: boolean;
  voice_evacuation?: boolean;
  special_notes?: string;
  system_scope?: string;
  bid_to_minimum_code?: boolean;
  monitoring_communication_type?: string | null;
  preferred_manufacturer?: string | null;
  preferred_panel_family?: string | null;
  current_step?: string;
}

export interface PlanUsage {
  planName: string;
  used: number;
  total: number;
}
