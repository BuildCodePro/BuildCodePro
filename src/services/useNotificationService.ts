import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export type NotificationType =
    | "company_registered"
    | "design_completed"
    | "subscription_upgraded"
    | "invoice_paid"
    | string;

export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    link: string;
    is_read: boolean;
    created_at: string;
    metadata: Record<string, unknown>;
}

export interface NotificationsResponse {
    items: NotificationItem[];
    unread_count: number;
    total: number;
}

export interface NotificationsParams {
    page?: number;
    page_size?: number;
}

export interface MarkNotificationsReadRequest {
    notification_ids: string[];
}

// --- API Functions ---

const getNotificationsApi = async (
    params?: NotificationsParams,
): Promise<NotificationsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.page_size)
        searchParams.append("page_size", String(params.page_size));

    const qs = searchParams.toString();
    return apiRequest<NotificationsResponse>(
        `${API_ENDPOINTS.NOTIFICATIONS.LIST}${qs ? `?${qs}` : ""}`,
    );
};

const markNotificationsReadApi = async (
    payload: MarkNotificationsReadRequest,
): Promise<string> => {
    return apiRequest<string>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

const markAllNotificationsReadApi = async (): Promise<string> => {
    return apiRequest<string>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
        method: "POST",
    });
};

// --- TanStack Query Hooks ---

export const useNotificationsQuery = (params?: NotificationsParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.NOTIFICATIONS.LIST(params),
        queryFn: () => getNotificationsApi(params),
    });
};

export const useMarkNotificationsReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markNotificationsReadApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

export const useMarkAllNotificationsReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsReadApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};