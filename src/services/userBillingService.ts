import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";
import type { StatWithDelta } from "./adminService";
import { InvoiceStatus } from "@/lib/constants/billing";

// --- Types ---

export interface AdminSubscriptionPlanSummary {
    plan_code: string;
    plan_name: string;
    amount_cents: number;
    monthly_design_limit: number;
    company_count: number;
}

export interface AdminSubscriptionStatsResponse {
    monthly_recurring_revenue_cents: StatWithDelta;
    active_subscriptions: StatWithDelta;
    at_design_limit: StatWithDelta;
    upgrades_this_month: StatWithDelta;
    plans: AdminSubscriptionPlanSummary[];
}

export type AdminSubscriptionStatus =
    | "active"
    | "at_limit"
    | "past_due"
    | "canceled"
    | "trialing"
    | "incomplete";

export interface AdminSubscriptionItem {
    company_id: string;
    company_name: string;
    plan_name: string;
    designs_used: number;
    designs_limit: number;
    billing_cycle: string;
    amount_cents: number;
    next_billing_at: string;
    status: AdminSubscriptionStatus;
}

export interface AdminSubscriptionsResponse {
    items: AdminSubscriptionItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface AdminSubscriptionsParams {
    page?: number;
    page_size?: number;
    search?: string | null;
    plan?: string | null;
    status?: AdminSubscriptionStatus | null;
}

export type AdminInvoiceStatus = "paid" | "open" | "void" | "uncollectible";

export interface AdminInvoiceItem {
    invoice_id: string;
    invoice_number: string;
    company_id: string;
    company_name: string;
    issued_at: string;
    plan_name: string;
    amount_cents: number;
    currency: string;
    status: AdminInvoiceStatus;
    pdf_url: string;
}

export interface AdminInvoicesResponse {
    items: AdminInvoiceItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface AdminInvoicesParams {
    page?: number;
    page_size?: number;
}

export interface AdminInvoicePdfResponse {
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



const getInvoicesApi = async (
    params?: AdminInvoicesParams,
): Promise<AdminInvoicesResponse> => {
    return apiRequest<AdminInvoicesResponse>(
        `${API_ENDPOINTS.USER_INVOICE.INVOICES_USER}${buildQueryString(
            params as Record<string, unknown> | undefined,
        )}`,
    );
};

const getInvoicePdfApi = async (
    invoiceId: string,
): Promise<AdminInvoicePdfResponse> => {
    return apiRequest<AdminInvoicePdfResponse>(
        API_ENDPOINTS.USER_INVOICE.INVOICE_PDF(invoiceId),
    );
};


export const useInvoicesQuery = (params?: AdminInvoicesParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.USER_INVOICE.INVOICES_USER(params),
        queryFn: () => getInvoicesApi(params),
    });
};

export const useInvoicePdfQuery = (
    invoiceId: string | null | undefined,
) => {
    return useQuery({
        queryKey: ["admin", "subscriptions", "invoice-pdf", invoiceId],
        queryFn: () => getInvoicePdfApi(invoiceId as string),
        enabled: false, // manually trigger via refetch() on button click
    });
};