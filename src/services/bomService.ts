import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export interface BomLineItem {
    id: string;
    bom_id: string;
    device_type: string;
    device_name: string;
    category: string;
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

export interface UpdateBomLinePricePayload {
    company_unit_price: number;
}

// --- API Functions ---

const getBomApi = async (projectId: string): Promise<BomResponse> => {
    return apiRequest<BomResponse>(API_ENDPOINTS.PROJECTS.BOM.GET(projectId));
};

export const updateBomLinePriceApi = async (
    projectId: string,
    lineId: string,
    payload: UpdateBomLinePricePayload
): Promise<BomLineItem> => {
    return apiRequest<BomLineItem>(
        API_ENDPOINTS.PROJECTS.BOM.UPDATE_LINE_PRICE(projectId, lineId),
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        }
    );
};

export const useBomQuery = (projectId: string | null | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.PROJECTS.BOM.GET(projectId as string),
        queryFn: () => getBomApi(projectId as string),
        enabled: !!projectId,
    });
};

export const useUpdateBomLinePriceMutation = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            lineId,
            payload,
        }: {
            lineId: string;
            payload: UpdateBomLinePricePayload;
        }) => updateBomLinePriceApi(projectId, lineId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.PROJECTS.BOM.GET(projectId),
            });
        },
    });
};