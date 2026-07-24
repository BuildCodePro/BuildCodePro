import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Shared Types ---

export interface StatWithDelta {
    total: number;
    delta: number;
    delta_label: string;
}

export interface PlanDistributionItem {
    plan_code: string;
    plan_name: string;
    company_count: number;
    monthly_revenue_cents: number;
}

// --- Dashboard Stats ---

export interface AdminDashboardStatsResponse {
    total_companies: StatWithDelta;
    active_users: StatWithDelta;
    monthly_revenue_cents: StatWithDelta;
    designs_generated: StatWithDelta;
    plan_distribution: PlanDistributionItem[];
}

// --- Companies ---

export type CompanyStatus = "active" | "suspended";

export interface AdminCompanyItem {
    company_id: string;
    company_name: string;
    contact_email: string;
    plan_name: string;
    user_count: number;
    project_count: number;
    designs_used: number;
    designs_limit: number;
    status: CompanyStatus;
    last_active_at: string;
}

export interface AdminCompaniesStats {
    total_companies: number;
    active_companies: number;
    suspended_companies: number;
}

export interface AdminCompaniesResponse {
    stats: AdminCompaniesStats;
    items: AdminCompanyItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface AdminCompaniesParams {
    page?: number;
    page_size?: number;
    search?: string | null;
    status?: "active" | "suspended" | null;
    plan?: string | null;
}

export type CompanyStatusAction = "activate" | "suspend";

export interface UpdateCompanyStatusRequest {
    action: CompanyStatusAction;
}

export interface UpdateCompanyStatusResponse {
    company_id: string;
    admin_status: string;
    subscription_cancel_at_period_end: boolean;
    message: string;
}

// --- Users ---

export type AdminUserRole =
    | "company_owner"
    | "estimator"
    | "engineer"
    | "super_admin";

export type AdminUserStatus = "active" | "pending" | "inactive";

export interface AdminUserItem {
    user_id: string;
    name: string;
    email: string;
    company_id: string;
    company_name: string;
    role: string;
    status: AdminUserStatus;
    last_login_at: string;
}

export interface AdminUsersStats {
    total_users: number;
    active_users: number;
    pending_verification: number;
    inactive_users: number;
}

export interface AdminUsersResponse {
    stats: AdminUsersStats;
    items: AdminUserItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface AdminUsersParams {
    page?: number;
    page_size?: number;
    search?: string | null;
    role?: AdminUserRole | null;
    status?: AdminUserStatus | null;
    company_id?: string | null;
}

// --- Activity ---

export type ActivityTag =
    | "signup"
    | "billing"
    | "design"
    | "suspension"
    | "user"
    | "project";

export interface AdminActivityItem {
    id: string;
    tag: ActivityTag;
    description: string;
    company_id: string;
    company_name: string;
    actor_user_id: string;
    actor_name: string;
    created_at: string;
}

export interface AdminActivityResponse {
    items: AdminActivityItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface AdminActivityParams {
    page?: number;
    page_size?: number;
    search?: string | null;
    tags?: ActivityTag[] | null;
}

// --- Helper: build query string ---

const buildQueryString = (params?: Record<string, unknown>): string => {
    if (!params) return "";
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
        } else {
            searchParams.append(key, String(value));
        }
    });

    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
};

// --- API Functions ---

const getDashboardStatsApi = async (): Promise<AdminDashboardStatsResponse> => {
    return apiRequest<AdminDashboardStatsResponse>(
        API_ENDPOINTS.ADMIN.DASHBOARD_STATS,
    );
};

const getCompaniesApi = async (
    params?: AdminCompaniesParams,
): Promise<AdminCompaniesResponse> => {
    return apiRequest<AdminCompaniesResponse>(
        `${API_ENDPOINTS.ADMIN.COMPANIES}${buildQueryString(params as Record<string, unknown> | undefined)}`,
    );
};

const updateCompanyStatusApi = async ({
    companyId,
    payload,
}: {
    companyId: string;
    payload: UpdateCompanyStatusRequest;
}): Promise<UpdateCompanyStatusResponse> => {
    return apiRequest<UpdateCompanyStatusResponse>(
        API_ENDPOINTS.ADMIN.UPDATE_COMPANY_STATUS(companyId),
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );
};

const getUsersApi = async (
    params?: AdminUsersParams,
): Promise<AdminUsersResponse> => {
    return apiRequest<AdminUsersResponse>(
        `${API_ENDPOINTS.ADMIN.USERS}${buildQueryString(params as Record<string, unknown> | undefined)}`,
    );
};

const getActivityApi = async (
    params?: AdminActivityParams,
): Promise<AdminActivityResponse> => {
    return apiRequest<AdminActivityResponse>(
        `${API_ENDPOINTS.ADMIN.ACTIVITY}${buildQueryString(params as Record<string, unknown> | undefined)}`,
    );
};

// --- TanStack Query Hooks ---

export const useAdminDashboardStatsQuery = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.DASHBOARD_STATS,
        queryFn: getDashboardStatsApi,
    });
};

export const useAdminCompaniesQuery = (params?: AdminCompaniesParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.COMPANIES(params as Record<string, unknown> | undefined),
        queryFn: () => getCompaniesApi(params),
    });
};

export const useUpdateCompanyStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCompanyStatusApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ADMIN.DASHBOARD_STATS,
            });
        },
    });
};

export const useAdminUsersQuery = (params?: AdminUsersParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.USERS(params as Record<string, unknown> | undefined),
        queryFn: () => getUsersApi(params),
    });
};

export const useAdminActivityQuery = (params?: AdminActivityParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.ACTIVITY(params as Record<string, unknown> | undefined),
        queryFn: () => getActivityApi(params),
    });
};