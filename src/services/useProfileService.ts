import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";
import { useAuthStore } from "@/store/auth-store";

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

// --- Helper: sync a fresh ProfileResponse into the persisted auth store ---
// Since these endpoints already return the full updated profile in their
// response, we sync directly from that response instead of re-fetching
// /auth/me — one less network round trip, and the store (and therefore
// localStorage, since useAuthStore uses zustand's `persist` middleware)
// is updated with the exact data the server just confirmed.
const syncProfileToStore = (
    profile: ProfileResponse,
    updateUser: (user: Record<string, unknown>) => void,
) => {
    updateUser({
        name: profile.full_name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
        companyName: profile.company_name,
        plan: profile.plan,
        modules: profile.modules,
    });
};

// --- TanStack Query Hooks ---

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();
    const updateUser = useAuthStore((s) => s.updateUser);

    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: (data) => {
            syncProfileToStore(data, updateUser);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
        },
    });
};

export const useUploadAvatarMutation = () => {
    const queryClient = useQueryClient();
    const updateUser = useAuthStore((s) => s.updateUser);

    return useMutation({
        mutationFn: uploadAvatarApi,
        onSuccess: (data) => {
            syncProfileToStore(data, updateUser);
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
    const updateUser = useAuthStore((s) => s.updateUser);

    return useMutation({
        mutationFn: verifyEmailChangeApi,
        onSuccess: async (data) => {
            // This endpoint returns only { message }, not the full profile,
            // so we need an explicit /auth/me refetch to get the new email.
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
            try {
                const fresh = await apiRequest<ProfileResponse>(
                    API_ENDPOINTS.AUTH?.ME ?? "/auth/me",
                );
                syncProfileToStore(fresh, updateUser);
            } catch (error) {
                console.error("Failed to resync profile after email change:", error);
            }
            return data;
        },
    });
};

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: changePasswordApi,
    });
};