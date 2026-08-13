import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export interface LlmModelOption {
    provider: string;
    model: string;
    label: string;
}

export interface LlmProviderEntry {
    provider: string;
    model: string;
}

export interface LlmProviderOrderResponse {
    providers: LlmProviderEntry[];
    available_models: LlmModelOption[];
    temperature?: number;
    max_output_tokens?: number;
}

export interface LiveProviderResult {
    provider: string;
    models: LlmModelOption[];
    error: string | null;
}

export interface LiveModelCatalogResponse {
    results: LiveProviderResult[];
}

export interface UpdateProviderOrderRequest {
    providers: LlmProviderEntry[];
    temperature?: number;
    max_output_tokens?: number;
}

// --- API Functions ---

const getLlmSettingsApi = async (): Promise<LlmProviderOrderResponse> => {
    return apiRequest<LlmProviderOrderResponse>(API_ENDPOINTS.ADMIN.LLM_SETTINGS);
};

const updateLlmSettingsApi = async (
    payload: UpdateProviderOrderRequest,
): Promise<LlmProviderOrderResponse> => {
    return apiRequest<LlmProviderOrderResponse>(API_ENDPOINTS.ADMIN.LLM_SETTINGS, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
};

const syncLlmModelsApi = async (): Promise<LiveModelCatalogResponse> => {
    return apiRequest<LiveModelCatalogResponse>(API_ENDPOINTS.ADMIN.LLM_SETTINGS_SYNC, {
        method: "POST",
    });
};

// --- TanStack Query Hooks ---

export const useGetLlmSettingsQuery = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.LLM_SETTINGS,
        queryFn: getLlmSettingsApi,
    });
};

export const useUpdateLlmSettingsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLlmSettingsApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ADMIN.LLM_SETTINGS,
            });
        },
    });
};

export const useSyncLlmModelsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncLlmModelsApi,
        onSuccess: () => {
            // Refetch settings so available_models reflects newly synced rows
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ADMIN.LLM_SETTINGS,
            });
        },
    });
};
