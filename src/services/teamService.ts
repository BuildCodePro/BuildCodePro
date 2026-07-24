import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from './api/endpoints';
import { QUERY_KEYS } from './api/keys';
import type { PlatformUserRole } from '@/types/super-admin';

// --- DTOs ---

export interface TeamStatsResponse {
    team_members: number;
    pending_invites: number;
    estimators: number;
    engineers: number;
}

export interface TeamMemberItem {
    id: string;
    member_type: string;
    name: string;
    email: string;
    role: PlatformUserRole;
    status: string; // active, pending, suspended
    is_active: boolean;
    last_activity_at: string;
}

export interface TeamMembersResponse {
    items: TeamMemberItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface UpdateTeamMemberDto {
    role?: PlatformUserRole;
}

// --- API Functions ---

const getTeamStatsApi = async (): Promise<TeamStatsResponse> => {
    return apiRequest<TeamStatsResponse>(API_ENDPOINTS.TEAM.STATS);
};

interface TeamMembersFilter {
    role?: string;
    status?: string;
    search?: string;
}

const getTeamMembersApi = async (
    page: number,
    pageSize: number,
    filters?: TeamMembersFilter
): Promise<TeamMembersResponse> => {
    let query = `${API_ENDPOINTS.TEAM.MEMBERS}?page=${page}&page_size=${pageSize}`;
    if (filters) {
        if (filters.role && filters.role !== 'all') {
            query += `&role=${encodeURIComponent(filters.role)}`;
        }
        if (filters.status && filters.status !== 'all') {
            query += `&status=${encodeURIComponent(filters.status)}`;
        }
        if (filters.search) {
            query += `&search=${encodeURIComponent(filters.search)}`;
        }
    }
    return apiRequest<TeamMembersResponse>(query);
};




const updateTeamMemberApi = async (userId: string, data: UpdateTeamMemberDto): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.TEAM.UPDATE_MEMBER(userId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

const deactivateTeamMemberApi = async (userId: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.TEAM.DEACTIVATE_MEMBER(userId), {
        method: 'POST',
    });
};

const activateTeamMemberApi = async (userId: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.TEAM.ACTIVATE_MEMBER(userId), {
        method: 'POST',
    });
};

const resendInviteApi = async (inviteId: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.INVITE_USER.RESEND_INVITE(inviteId), {
        method: 'POST',
    });
};

const revokeInviteApi = async (inviteId: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.INVITE_USER.REVOKE_INVITE(inviteId), {
        method: 'DELETE',
    });
};

// --- TanStack Query Hooks ---

export const useTeamStatsQuery = () => {
    return useQuery({
        queryKey: QUERY_KEYS.TEAM.STATS,
        queryFn: getTeamStatsApi,
    });
};

interface UseTeamMembersParams {
    page?: number;
    pageSize?: number;
    role?: string;
    status?: string;
    search?: string;
}

export const useTeamMembersQuery = ({
    page = 1,
    pageSize = 20,
    role,
    status,
    search,
}: UseTeamMembersParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.TEAM.MEMBERS({ page, pageSize, role, status, search }),
        queryFn: () => getTeamMembersApi(page, pageSize, { role, status, search }),
    });
};


export const useUpdateTeamMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateTeamMemberDto }) => updateTeamMemberApi(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAM.MEMBERS() });
        },
    });
};

export const useDeactivateTeamMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deactivateTeamMemberApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAM.MEMBERS() });
        },
    });
};

export const useActivateTeamMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: activateTeamMemberApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAM.MEMBERS() });
        },
    });
};

export const useResendInviteMutation = () => {
    return useMutation({
        mutationFn: resendInviteApi,
    });
};

export const useRevokeInviteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: revokeInviteApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAM.MEMBERS() });
        },
    });
};
