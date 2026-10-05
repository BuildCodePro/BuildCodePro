export type BomCategory =
    | "initiating_devices"
    | "notification_appliances"
    | "control_equipment"
    | (string & {}); // allow any other category the API may return in future

export type PartResolutionStatus =
    | "spec"
    | "past_bom"
    | "catalog"
    | "web"
    | "unresolved";

export interface BomLineItem {
    id: string;
    bom_id: string;
    device_type: string;
    device_name: string;
    category: BomCategory;
    quantity: number;
    unit: string;
    ai_unit_price: number;
    ai_price_source: string | null;
    company_unit_price: number | null;
    effective_price: number;
    line_total: number;
    confidence: number; // 0 - 1 fraction, e.g. 0.96 = 96%
    notes: string | null;
    review_note?: string | null;
    manufacturer: string | null;
    part_number: string | null;
    datasheet_url: string | null;
    listing_url: string | null;
    spec_reference: string | null;
    resolution_status: PartResolutionStatus;
    resolution_confidence: number | null;
    resolution_note: string | null;
    is_resolved_to_part: boolean;
    needs_review?: boolean;
    is_manual_override?: boolean;
    needs_review_after_rerun?: boolean;
    original_values?: Record<string, string | number | null> | null;
    is_deleted?: boolean;
    updated_by_user_id?: string | null;
    created_at: string;
    updated_at: string;
}

export interface BomLineUpdatePayload {
    quantity?: number;
    company_unit_price?: number;
    device_name?: string;
    unit?: string;
    manufacturer?: string | null;
    part_number?: string | null;
    notes?: string | null;
  mark_reviewed?: boolean;
}

export interface BomLineCreatePayload {
    device_type: string;
    device_name: string;
    category: "initiating_devices" | "notification_appliances" | "control_equipment" | "wiring" | "conduit" | "miscellaneous";
    quantity: number;
    unit: string;
    company_unit_price: number;
    manufacturer?: string | null;
    part_number?: string | null;
    notes?: string | null;
}

export interface BomLineRevision {
    id: string;
    bom_line_id: string;
    changed_by_user_id: string | null;
    action: "created" | "updated" | "deleted" | "restored";
    changes: Record<string, { from: unknown; to: unknown } | unknown>;
    created_at: string;
}

export interface BomResponse {
    id: string;
    project_id: string;
    company_id: string;
    analysis_job_id: string;
    total_cost: number;
    currency: string;
    status: string;
    lines: BomLineItem[];
    unpriced_line_count?: number;
    total_cost_is_partial?: boolean;
    created_at: string;
    updated_at: string;
}