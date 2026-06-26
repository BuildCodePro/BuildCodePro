export type DesignWizardStep =
  | "upload"
  | "project-info"
  | "ai-analysis"
  | "results";

export interface DesignStep {
  id: DesignWizardStep;
  number: number;
  label: string;
}

export type UploadedFileStatus = "uploading" | "ready" | "error";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: UploadedFileStatus;
}

export interface DesignChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface ProjectInfoFormData {
  projectName: string;
  address: string;
  jurisdiction: string;
  squareFootage: string;
  numberOfFloors: string;
  occupancyType: string;
  optionalSystems: {
    sprinkler: boolean;
    elevator: boolean;
    ductDetectors: boolean;
    voiceEvacuation: boolean;
  };
  specialNotes: string;
}

export type AnalysisTaskStatus = "pending" | "active" | "completed";

export interface AnalysisTask {
  id: string;
  label: string;
}

export interface AnalysisTaskState extends AnalysisTask {
  status: AnalysisTaskStatus;
}

export type ResultsTabId =
  | "design-recommendations"
  | "bom"
  | "compliance"
  | "narrative"
  | "exports";

export interface ResultsTab {
  id: ResultsTabId;
  label: string;
}

export interface ResultsMetric {
  id: string;
  label: string;
  value: string;
  description: string;
}

export type RecommendationAccent = "red" | "yellow" | "green" | "orange";

export type RecommendationBadgeVariant = "success" | "warning";

export interface DesignRecommendation {
  id: string;
  title: string;
  count: string;
  description: string;
  accent: RecommendationAccent;
  badge?: string;
  badgeVariant?: RecommendationBadgeVariant;
}

export interface DesignResults {
  metrics: ResultsMetric[];
  recommendations: DesignRecommendation[];
  generatedAt: string;
  bomTotalItems?: number;
  compliance?: ComplianceResults;
  narrative?: DesignNarrative;
}

export type BomCategoryId =
  | "devices"
  | "wiring"
  | "conduit"
  | "control-equipment";

export interface BomLineItem {
  id: string;
  item: string;
  category: string;
  qty: number;
  unit: string;
  notes: string;
  confidence: number;
}

export interface BomCategory {
  id: BomCategoryId;
  label: string;
  items: BomLineItem[];
}

export type ComplianceItemStatus = "pass" | "review-needed" | "concern";

export interface ComplianceChecklistItem {
  id: string;
  label: string;
  status: ComplianceItemStatus;
}

export interface ComplianceChecklistSection {
  id: string;
  title: string;
  items: ComplianceChecklistItem[];
}

export interface ComplianceResults {
  score: number;
  reviewCount: number;
  statusLabel: string;
  sections: ComplianceChecklistSection[];
}

export interface DesignNarrativeSection {
  id: string;
  title: string;
  content: string;
}

export interface DesignNarrative {
  sections: DesignNarrativeSection[];
  includeInExport: boolean;
}

export type ExportFormatId = "pdf" | "csv" | "print" | "email";

export interface ExportFormatOption {
  id: ExportFormatId;
  title: string;
  description: string;
}

export interface ExportIncludeOption {
  id: string;
  label: string;
  defaultChecked: boolean;
}

export interface ExportPreviewData {
  projectName: string;
  occupancy: string;
  address: string;
  squareFootage: string;
  floors: string;
  initiatingDevices: string;
  notificationDevices: string;
  controlDevices: string;
  totalItems: string;
  estimatedCable: string;
  estimatedConduit: string;
  complianceScore: string;
  complianceStatus: string;
  flaggedItems: string;
}

export const DEFAULT_PROJECT_INFO: ProjectInfoFormData = {
  projectName: "",
  address: "",
  jurisdiction: "",
  squareFootage: "",
  numberOfFloors: "",
  occupancyType: "",
  optionalSystems: {
    sprinkler: true,
    elevator: false,
    ductDetectors: true,
    voiceEvacuation: false,
  },
  specialNotes: "",
};
