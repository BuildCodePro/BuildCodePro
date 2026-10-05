export interface ComplianceChecklistApiItem {
  id: string;
  label: string;
  status: ComplianceRowStatus;
  rule_reference: string | null;
  message: string | null;
}

export interface ComplianceChecklistApiSection {
  title: string;
  items: ComplianceChecklistApiItem[];
}

export type ComplianceRowStatus =
  | "pass"
  | "review_needed"
  | "concern"
  | "unresolved";

export interface ComplianceMatrixApiItem {
  id: string;
  requirement: string;
  status: ComplianceRowStatus;
  code_reference: string | null;
  amendment_reference: string | null;
  confidence: number | null;
  required_action: string | null;
  requires_human_confirmation: boolean;
  inputs_used: Record<string, string>;
  assumptions: string[];
  resolved_by_user_id: string | null;
}

export interface CalculationApiResult {
  calculation_kind: string;
  formula_key: string;
  formula_expression: string;
  inputs: Record<string, string>;
  result_value: number;
  result_unit: string;
  limit_value: number | null;
  passed: boolean;
  code_reference: string;
  assumptions: string[];
}

export interface DeviceLoadSummaryApi {
  total_standby_current_amps: number;
  total_alarm_current_amps: number;
  addressable_device_count: number;
  strobe_count: number;
  total_device_count: number;
  unmatched_device_types: string[];
}

export interface ScopeExclusionApi {
  device_type: string;
  quantity: number;
  exclusion_reason: string;
}

export interface ComplianceChecklistApiResponse {
  analysis_job_id: string;
  compliance_score_pct: number;
  review_flags_count: number;
  sections: ComplianceChecklistApiSection[];
  disclaimer: string;
  generated_at: string;
  matrix: ComplianceMatrixApiItem[];
  unresolved_count: number;
  device_load_summary: DeviceLoadSummaryApi | null;
  calculations: CalculationApiResult[] | null;
  scope_summary: string | null;
  scope_exclusions: ScopeExclusionApi[];
  missing_required_device_types: string[];
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
