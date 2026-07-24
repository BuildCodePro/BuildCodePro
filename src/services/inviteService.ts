import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from './api/endpoints';
import { QUERY_KEYS } from './api/keys';
import { useAuthStore } from '@/store/auth-store';
import { applySession, type LoginApiResponse } from './authService';
import type { UserRole } from '@/types/auth';

// --- DTOs ---

export type SendInviteDto = {
    email: string;
    role: UserRole;
};

export type AcceptInviteDto = {
    token: string;
    password: string;
};

// --- API Response Types ---

export interface SendInviteApiResponse {
    message?: string;
    data?: {
        id?: string;
        email?: string;
        role?: UserRole;
        status?: string;
        created_at?: string;
    };
}

export interface AcceptInviteApiResponse {
    message?: string;
    access_token?: string | null;
    refresh_token?: string | null;
    token_type?: string;
    role?: UserRole | null;
    data?: {
        id?: string;
        email?: string;
        name?: string;
        role?: UserRole;
    };
}

// --- API Functions ---

const sendInviteApi = async (data: SendInviteDto): Promise<SendInviteApiResponse> => {
    return apiRequest<SendInviteApiResponse>(API_ENDPOINTS.INVITE_USER.SEND_INVITE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

const acceptInviteApi = async (data: AcceptInviteDto): Promise<AcceptInviteApiResponse> => {
    return apiRequest<AcceptInviteApiResponse>(API_ENDPOINTS.INVITE_USER.ACCEPT_INVITE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

// --- TanStack Query Hooks ---

export const useSendInviteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sendInviteApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVITE_USER.SEND_INVITE });
        },
    });
};

export const useAcceptInviteMutation = () => {
    const setSession = useAuthStore((s) => s.setSession);

    return useMutation({
        mutationFn: async (data: AcceptInviteDto) => {
            const response = await acceptInviteApi(data);
            const hasToken =
                response?.access_token ||
                (response as LoginApiResponse)?.accessToken ||
                (response as LoginApiResponse)?.token ||
                (response as LoginApiResponse)?.payload?.accessToken ||
                (response as LoginApiResponse)?.data?.accessToken ||
                (response as LoginApiResponse)?.data?.token;

            if (hasToken) {
                applySession(response as LoginApiResponse, setSession);
            }

            return response;
        },
    });
};