import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export interface ModuleFeatures {
    ai_design_engine: boolean;
    bom_generation: boolean;
    pdf_export: boolean;
    compliance_engine: boolean;
    csv_export: boolean;
    team_accounts: boolean;
    dedicated_support: boolean;
}

export interface CurrentPlan {
    code: string;
    name: string;
    amount_cents: number;
    currency: string;
    monthly_design_limit: number;
    features: ModuleFeatures;
}

export interface ProfileResponse {
    avatar_url: string;
    email: string;
    full_name: string;
    company_name: string;
    plan: CurrentPlan;
    modules: ModuleFeatures;
}

export interface UpdateProfileRequest {
    full_name: string;
}

export interface RequestEmailChangeRequest {
    new_email: string;
}

export interface VerifyEmailChangeRequest {
    token: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
}

export interface MessageResponse {
    message: string;
}

// --- API Functions ---

const updateProfileApi = async (
    payload: UpdateProfileRequest,
): Promise<ProfileResponse> => {
    return apiRequest<ProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
};

const uploadAvatarApi = async (file: File): Promise<ProfileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<ProfileResponse>(API_ENDPOINTS.PROFILE.UPLOAD_AVATAR, {
        method: "POST",
        body: formData,
    });
};

const requestEmailChangeApi = async (
    payload: RequestEmailChangeRequest,
): Promise<MessageResponse> => {
    return apiRequest<MessageResponse>(
        API_ENDPOINTS.PROFILE.REQUEST_EMAIL_CHANGE,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
};

const verifyEmailChangeApi = async (
    payload: VerifyEmailChangeRequest,
): Promise<MessageResponse> => {
    return apiRequest<MessageResponse>(
        API_ENDPOINTS.PROFILE.VERIFY_EMAIL_CHANGE,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
};

const changePasswordApi = async (
    payload: ChangePasswordRequest,
): Promise<MessageResponse> => {
    return apiRequest<MessageResponse>(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

// --- TanStack Query Hooks ---

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
        },
    });
};

export const useUploadAvatarMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadAvatarApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
        },
    });
};

export const useRequestEmailChangeMutation = () => {
    return useMutation({
        mutationFn: requestEmailChangeApi,
    });
};

export const useVerifyEmailChangeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: verifyEmailChangeApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
        },
    });
};

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: changePasswordApi,
    });
};