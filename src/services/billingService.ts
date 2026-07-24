import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export interface PlanFeatures {
    ai_design_engine: boolean;
    bom_generation: boolean;
    pdf_export: boolean;
    compliance_engine: boolean;
    csv_export: boolean;
    team_accounts: boolean;
    dedicated_support: boolean;
}

export interface Plan {
    code: string;
    name: string;
    amount_cents: number;
    currency: string;
    monthly_design_limit: number;
    features: PlanFeatures;
}

export interface PlansResponse {
    items: Plan[];
}

export type SubscriptionStatus =
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";

export interface SubscriptionResponse {
    plan_code: string;
    plan_name: string;
    subscription_status: SubscriptionStatus;
    monthly_design_limit: number;
    monthly_designs_used: number;
    current_period_end: string;
    cancel_at_period_end: boolean;
    stripe_customer_id: string;
}

export interface CheckoutRequest {
    plan_code: string;
}

export interface CheckoutResponse {
    checkout_url: string;
    session_id: string;
}

export interface PortalResponse {
    portal_url: string;
}

// --- API Functions ---

const getPlansApi = async (): Promise<PlansResponse> => {
    return apiRequest<PlansResponse>(API_ENDPOINTS.BILLING.PLANS);
};

const getSubscriptionApi = async (): Promise<SubscriptionResponse> => {
    return apiRequest<SubscriptionResponse>(API_ENDPOINTS.BILLING.SUBSCRIPTION);
};

const checkoutApi = async (
    payload: CheckoutRequest,
): Promise<CheckoutResponse> => {
    return apiRequest<CheckoutResponse>(API_ENDPOINTS.BILLING.CHECKOUT, {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

const portalApi = async (): Promise<PortalResponse> => {
    return apiRequest<PortalResponse>(API_ENDPOINTS.BILLING.PORTAL, {
        method: "POST",
    });
};

// --- TanStack Query Hooks ---

export const usePlansQuery = () => {
    return useQuery({
        queryKey: QUERY_KEYS.BILLING.PLANS,
        queryFn: getPlansApi,
    });
};

export const useSubscriptionQuery = () => {
    return useQuery({
        queryKey: QUERY_KEYS.BILLING.SUBSCRIPTION,
        queryFn: getSubscriptionApi,
    });
};

export const useCheckoutMutation = () => {
    return useMutation({
        mutationFn: checkoutApi,
    });
};

export const usePortalMutation = () => {
    return useMutation({
        mutationFn: portalApi,
    });
};