import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export type TicketCategory = "technical" | "account" | "general_inquiry";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface TicketCompany {
    id: string;
    name: string;
}

export interface TicketUser {
    id: string;
    name: string;
    email: string;
}

export interface TicketComment {
    id: string;
    body: string;
    author: TicketUser;
    created_at: string;
}

export interface SupportTicket {
    id: string;
    ticket_reference: string;
    subject: string;
    category: TicketCategory;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    company: TicketCompany;
    created_by: TicketUser;
    assigned_to: TicketUser | null;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
    comments: TicketComment[];
}

export interface SupportTicketListItem {
    id: string;
    ticket_reference: string;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    priority: TicketPriority;
    company: TicketCompany;
    created_by: TicketUser;
    created_at: string;
    updated_at: string;
}

export interface PaginatedTickets {
    items: SupportTicketListItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface TicketListParams {
    page?: number;
    page_size?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    search?: string;
    [key: string]: unknown; // <-- add this

}

export interface CreateTicketPayload {
    subject: string;
    category: TicketCategory;
    description: string;
}

export interface AddCommentPayload {
    body: string;
}

export interface UpdateAdminTicketPayload {
    status?: TicketStatus;
    priority?: TicketPriority;
    assigned_to_user_id?: string;
}

export interface SupportStats {
    open_ticket_count: number;
    high_priority_open_count: number;
    resolved_today_count: number;
    pending_general_inquiry_count: number;
}

// --- Helpers ---

const buildQueryString = (params?: Record<string, unknown>) => {
    if (!params) return "";
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });
    const qs = query.toString();
    return qs ? `?${qs}` : "";
};

// --- API Functions: User-facing Support ---

const createSupportTicketApi = async (
    payload: CreateTicketPayload,
): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(API_ENDPOINTS.SUPPORT.TICKETS.CREATE(), {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

const listSupportTicketsApi = async (
    params?: TicketListParams,
): Promise<PaginatedTickets> => {
    return apiRequest<PaginatedTickets>(
        `${API_ENDPOINTS.SUPPORT.TICKETS.LIST()}${buildQueryString(params)}`,
    );
};

const getSupportTicketApi = async (
    ticketId: string,
): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(
        API_ENDPOINTS.SUPPORT.TICKETS.GET(ticketId),
    );
};

const addSupportTicketCommentApi = async ({
    ticketId,
    payload,
}: {
    ticketId: string;
    payload: AddCommentPayload;
}): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(
        API_ENDPOINTS.SUPPORT.TICKETS.ADD_COMMENT(ticketId),
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
};

// --- API Functions: Admin Support ---

const getSupportStatsApi = async (): Promise<SupportStats> => {
    return apiRequest<SupportStats>(API_ENDPOINTS.ADMIN.SUPPORT.STATS());
};

const listAdminTicketsApi = async (
    params?: TicketListParams,
): Promise<PaginatedTickets> => {
    return apiRequest<PaginatedTickets>(
        `${API_ENDPOINTS.ADMIN.SUPPORT.TICKETS.LIST()}${buildQueryString(params)}`,
    );
};

const getAdminTicketApi = async (ticketId: string): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(
        API_ENDPOINTS.ADMIN.SUPPORT.TICKETS.GET(ticketId),
    );
};

const updateAdminTicketApi = async ({
    ticketId,
    payload,
}: {
    ticketId: string;
    payload: UpdateAdminTicketPayload;
}): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(
        API_ENDPOINTS.ADMIN.SUPPORT.TICKETS.UPDATE(ticketId),
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );
};

const addAdminTicketCommentApi = async ({
    ticketId,
    payload,
}: {
    ticketId: string;
    payload: AddCommentPayload;
}): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(
        API_ENDPOINTS.ADMIN.SUPPORT.TICKETS.ADD_COMMENT(ticketId),
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
};

// --- TanStack Query Hooks: User-facing Support ---

export const useCreateSupportTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSupportTicketApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["support", "tickets", "list"],
            });
        },
    });
};

export const useSupportTicketsQuery = (params?: TicketListParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.SUPPORT.TICKETS.LIST(params),
        queryFn: () => listSupportTicketsApi(params),
    });
};

export const useSupportTicketQuery = (ticketId: string | null | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.SUPPORT.TICKETS.DETAIL(ticketId as string),
        queryFn: () => getSupportTicketApi(ticketId as string),
        enabled: !!ticketId,
    });
};

export const useAddSupportTicketCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addSupportTicketCommentApi,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.SUPPORT.TICKETS.DETAIL(variables.ticketId),
            });
        },
    });
};

// --- TanStack Query Hooks: Admin Support ---

export const useSupportStatsQuery = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.SUPPORT.STATS(),
        queryFn: getSupportStatsApi,
    });
};

export const useAdminTicketsQuery = (params?: TicketListParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.SUPPORT.TICKETS.LIST(params),
        queryFn: () => listAdminTicketsApi(params),
    });
};

export const useAdminTicketQuery = (ticketId: string | null | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.SUPPORT.TICKETS.DETAIL(ticketId as string),
        queryFn: () => getAdminTicketApi(ticketId as string),
        enabled: !!ticketId,
    });
};

export const useUpdateAdminTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAdminTicketApi,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ADMIN.SUPPORT.TICKETS.DETAIL(variables.ticketId),
            });
            queryClient.invalidateQueries({
                queryKey: ["admin", "support", "tickets", "list"],
            });
        },
    });
};

export const useAddAdminTicketCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addAdminTicketCommentApi,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ADMIN.SUPPORT.TICKETS.DETAIL(variables.ticketId),
            });
        },
    });
};