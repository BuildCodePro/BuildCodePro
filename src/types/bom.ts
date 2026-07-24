export type BomCategory =
    | "initiating_devices"
    | "notification_appliances"
    | "control_equipment"
    | (string & {}); // allow any other category the API may return in future

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
    created_at: string;
    updated_at: string;
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
    created_at: string;
    updated_at: string;
}