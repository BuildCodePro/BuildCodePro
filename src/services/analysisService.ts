import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { useQuery as useQueryAlias } from "@tanstack/react-query";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---



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
export interface Drawing {
    id: string;
    project_id: string;
    company_id: string;
    uploaded_by_user_id: string | null;
    file_name: string;
    content_type: string;
    file_size: number;
    status: string;
    file_url: string;
    created_at: string;
    updated_at: string;
}

export interface AnalysisResultResponse {
    analysis_job_id: string;
    drawings: Drawing[];
    status: string;
    stats: AnalysisStats;
    recommendations: AnalysisRecommendations;
    bom_summary: AnalysisBomSummary;
    total_cost: number;
    /** True when the BOM figures belong to this job; false when a newer job
     *  has overwritten the project-level BOM singleton. */
    bom_current: boolean;
}

// --- Job list types ---

export type AnalysisJobStatus =
    | "pending"
    | "running"
    | "completed"
    | "failed"
    | "cancelled";

export interface AnalysisJobItem {
    id: string;
    project_id: string;
    status: AnalysisJobStatus;
    current_step: string | null;
    progress_pct: number;
    error_message: string | null;
    pages_total: number | null;
    pages_processed: number | null;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}

export interface AnalysisJobListResponse {
    items: AnalysisJobItem[];
    total: number;
}

// --- API Functions ---

const getAnalysisJobApi = async (
    projectId: string,
    jobId: string,
): Promise<AnalysisJobItem> => {
    return apiRequest<AnalysisJobItem>(
        API_ENDPOINTS.PROJECTS.ANALYSIS.JOB_DETAIL(projectId, jobId),
    );
};

const getAnalysisResultApi = async (
    projectId: string,
): Promise<AnalysisResultResponse> => {
    return apiRequest<AnalysisResultResponse>(
        API_ENDPOINTS.PROJECTS.ANALYSIS.RESULT(projectId),
    );
};

export const getAnalysisJobsApi = async (
    projectId: string,
): Promise<AnalysisJobListResponse> => {
    return apiRequest<AnalysisJobListResponse>(
        API_ENDPOINTS.PROJECTS.ANALYSIS.JOBS_LIST(projectId),
    );
};

const getAnalysisJobResultApi = async (
    projectId: string,
    jobId: string,
): Promise<AnalysisResultResponse> => {
    return apiRequest<AnalysisResultResponse>(
        API_ENDPOINTS.PROJECTS.ANALYSIS.JOB_RESULT(projectId, jobId),
    );
};

// --- TanStack Query Hooks ---

export const useAnalysisJobQuery = (
    projectId: string | null | undefined,
    jobId: string | null | undefined,
) => {
    return useQuery({
        queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.JOB_DETAIL(projectId as string, jobId as string),
        queryFn: () => getAnalysisJobApi(projectId as string, jobId as string),
        enabled: !!projectId && !!jobId,
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

export const useAnalysisJobsQuery = (
    projectId: string | null | undefined,
    options?: { refetchInterval?: number | false | ((query: any) => number | false | undefined) }
) => {
    return useQueryAlias({
        queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.JOBS(projectId as string),
        queryFn: () => getAnalysisJobsApi(projectId as string),
        enabled: !!projectId,
        ...options,
    });
};

export const useAnalysisJobResultQuery = (
    projectId: string | null | undefined,
    jobId: string | null | undefined,
) => {
    return useQueryAlias({
        queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.JOB_RESULT(projectId as string, jobId as string),
        queryFn: () => getAnalysisJobResultApi(projectId as string, jobId as string),
        enabled: !!projectId && !!jobId,
    });
};