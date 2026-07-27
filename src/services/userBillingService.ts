import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";
import { useAuthStore } from "@/store/auth-store";

// --- Types ---

export type UserInvoiceStatus = "paid" | "open" | "void" | "uncollectible";

export interface UserInvoiceItem {
    invoice_id: string;
    invoice_number: string;
    company_id: string;
    company_name: string;
    issued_at: string;
    plan_name: string;
    amount_cents: number;
    currency: string;
    status: UserInvoiceStatus;
    pdf_url: string;
}

export interface UserInvoicesResponse {
    items: UserInvoiceItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface UserInvoicesParams {
    page?: number;
    page_size?: number;
}

export interface UserInvoicePdfResponse {
    invoice_id: string;
    pdf_url: string;
}

// --- Helper ---

const buildQueryString = (params?: Record<string, unknown>): string => {
    if (!params) return "";
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        searchParams.append(key, String(value));
    });

    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
};

// --- API Functions ---

const getInvoicesApi = async (
    params?: UserInvoicesParams,
): Promise<UserInvoicesResponse> => {
    return apiRequest<UserInvoicesResponse>(
        `${API_ENDPOINTS.USER_INVOICE.INVOICES_USER}${buildQueryString(
            params as Record<string, unknown> | undefined,
        )}`,
    );
};

const getInvoicePdfApi = async (
    invoiceId: string,
): Promise<UserInvoicePdfResponse> => {
    return apiRequest<UserInvoicePdfResponse>(
        API_ENDPOINTS.USER_INVOICE.INVOICE_PDF(invoiceId),
    );
};

// --- TanStack Query Hooks ---

export const useInvoicesQuery = (params?: UserInvoicesParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.USER_INVOICE.INVOICES_USER(params),
        queryFn: () => getInvoicesApi(params),
    });
};

// Client-side safety filter using the logged-in user's company_id from
// the persisted auth store — no need for the caller to pass it manually,
// and it protects against the API returning cross-company data if the
// backend doesn't scope this endpoint by company itself.
export const useMyInvoicesQuery = (params?: UserInvoicesParams) => {
    const companyId = useAuthStore((s) => s.user?.company_id ?? s.user?.id);

    const query = useInvoicesQuery(params);

    const filteredItems = companyId
        ? query.data?.items.filter((invoice) => invoice.company_id === companyId)
        : query.data?.items;

    return {
        ...query,
        data: query.data
            ? { ...query.data, items: filteredItems ?? [] }
            : query.data,
    };
};

export const useInvoicePdfQuery = (invoiceId: string | null | undefined) => {
    return useQuery({
        queryKey: ["user", "invoices", "invoice-pdf", invoiceId],
        queryFn: () => getInvoicePdfApi(invoiceId as string),
        enabled: false, // manually trigger via refetch() on button click
    });
};