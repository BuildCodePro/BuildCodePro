export type ProjectIntakeStatus = "pending" | "running" | "ready" | "failed";

export interface IntakeField<ValueType> {
  value: ValueType | null;
  confidence: number;
  source_sheet: string | null;
  source_page: number | null;
  review_note?: string | null;
}

export interface ProjectIntakeResult {
  project_name: IntakeField<string>;
  street_address: IntakeField<string>;
  city: IntakeField<string>;
  state: IntakeField<string>;
  zip_code: IntakeField<string>;
  occupancy_classification: IntakeField<string>;
  construction_type: IntakeField<string>;
  square_footage: IntakeField<number>;
  number_of_floors: IntakeField<number>;
  has_basement?: IntakeField<boolean>;
  work_area_square_footage?: IntakeField<number>;
  sprinkler_system: IntakeField<boolean>;
  sprinkler_standard: IntakeField<string>;
  ibc_edition: IntakeField<string>;
  ifc_edition: IntakeField<string>;
  nfpa72_edition: IntakeField<string>;
  nec_edition: IntakeField<string>;
  ahj: IntakeField<string>;
  scope_hints: string[];
}

export interface ProjectIntakeResponse {
  project_id: string;
  status: ProjectIntakeStatus;
  result: ProjectIntakeResult | null;
  error_message: string | null;
  updated_at: string | null;
}

export interface IntakeFieldSource {
  sourceLabel: string;
  confidence: number;
  reviewNote?: string | null;
}
