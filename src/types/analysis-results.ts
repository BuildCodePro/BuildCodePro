export interface ComplianceChecklistApiItem {
  id: string;
  label: string;
  status: "pass" | "review_needed" | "concern";
  rule_reference: string | null;
  message: string | null;
}

export interface ComplianceChecklistApiSection {
  title: string;
  items: ComplianceChecklistApiItem[];
}

export interface ComplianceChecklistApiResponse {
  analysis_job_id: string;
  compliance_score_pct: number;
  review_flags_count: number;
  sections: ComplianceChecklistApiSection[];
  disclaimer: string;
  generated_at: string;
}

export interface DesignNarrativeApiSections {
  project_summary: string;
  design_assumptions: string;
  device_placement_logic: string;
  material_estimate_summary: string;
  compliance_notes: string;
  review_disclaimer: string;
}

export interface DesignNarrativeApiResponse {
  analysis_job_id: string;
  generated_at: string;
  edited_at: string | null;
  include_in_export: boolean;
  sections: DesignNarrativeApiSections;
}

export interface UpdateDesignNarrativePayload {
  sections: DesignNarrativeApiSections;
  include_in_export: boolean;
}
