import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export interface StartAnalysisResponse {
    job_id: string;
    message: string;
}


// --- Types ---

export interface AnalysisStats {
    suggested_devices: number;
    suggested_devices_label: string;
    estimated_wiring_ft: number;
    estimated_wiring_label: string;
    compliance_status_pct: number;
    compliance_label: string;
    review_flags_count: number;
    review_flags_label: string;
}

export interface AnalysisRecommendationCategory {
    score_pct: number | null;
    device_count: number | null;
    flag_count: number | null;
    description: string;
    items: string[];
}

export interface AnalysisRecommendations {
    initiating_devices: AnalysisRecommendationCategory;
    notification_appliances: AnalysisRecommendationCategory;
    control_equipment: AnalysisRecommendationCategory;
    review_required: AnalysisRecommendationCategory;
    // Allow any additional recommendation categories the API may return
    // in the future without breaking the type.
    [key: string]: AnalysisRecommendationCategory;
}

export interface AnalysisBomSummary {
    devices: number;
    wiring: number;
    conduit: number;
    control_equipment: number;
    total_items: number;
}

export interface AnalysisResultResponse {
    analysis_job_id: string;
    status: string;
    stats: AnalysisStats;
    recommendations: AnalysisRecommendations;
    bom_summary: AnalysisBomSummary;
    total_cost: number;
}

// --- API Function ---

// --- API Function ---

const startAnalysisApi = async (projectId: string): Promise<StartAnalysisResponse> => {
    return apiRequest<StartAnalysisResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.START(projectId), {
        method: "POST",
    });
};

// --- TanStack Query Hook ---
const getAnalysisResultApi = async (
    projectId: string,
): Promise<AnalysisResultResponse> => {
    return apiRequest<AnalysisResultResponse>(
        API_ENDPOINTS.PROJECTS.ANALYSIS.RESULT(projectId),
    );
};

export const useStartAnalysisMutation = () => {
    return useMutation({
        mutationFn: startAnalysisApi,
    });
};


export const useAnalysisResultQuery = (
    projectId: string | null | undefined,
) => {
    return useQuery({
        queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.RESULT(projectId as string),
        queryFn: () => getAnalysisResultApi(projectId as string),
        enabled: !!projectId,
    });
};