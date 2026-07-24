import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

// --- Types ---

export type HelpArticleCategory =
    | "getting_started"
    | "upload_drawings"
    | "ai_analysis"
    | "team_billing"
    | "troubleshooting";

export interface HelpArticleItem {
    id: string;
    title: string;
    category: HelpArticleCategory;
    summary: string;
    read_time_minutes: number;
    sort_order: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface HelpArticleDetail extends HelpArticleItem {
    body: string;
}

export interface HelpArticlesResponse {
    items: HelpArticleItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface HelpArticlesParams {
    page?: number;
    page_size?: number;
    category?: HelpArticleCategory | null;
    is_published?: boolean | null;
    search?: string | null;
}

export interface CreateHelpArticleRequest {
    title: string;
    category: HelpArticleCategory;
    summary: string;
    body: string;
    read_time_minutes: number;
    sort_order: number;
    is_published: boolean;
}

export type UpdateHelpArticleRequest = CreateHelpArticleRequest;

// --- Helper: build query string ---

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

const getArticlesApi = async (
    params?: HelpArticlesParams,
): Promise<HelpArticlesResponse> => {
    return apiRequest<HelpArticlesResponse>(
        `${API_ENDPOINTS.ADMIN.SUPPORT.ARTICLES}${buildQueryString(
            params as Record<string, unknown> | undefined,
        )}`,
    );
};

const getArticleDetailApi = async (
    articleId: string,
): Promise<HelpArticleDetail> => {
    return apiRequest<HelpArticleDetail>(
        API_ENDPOINTS.ADMIN.SUPPORT.ARTICLE_DETAIL(articleId),
    );
};

const createArticleApi = async (
    payload: CreateHelpArticleRequest,
): Promise<HelpArticleDetail> => {
    return apiRequest<HelpArticleDetail>(API_ENDPOINTS.ADMIN.SUPPORT.ARTICLES, {
        method: "POST",
        body: JSON.stringify(payload),
    });
};

const updateArticleApi = async ({
    articleId,
    payload,
}: {
    articleId: string;
    payload: UpdateHelpArticleRequest;
}): Promise<HelpArticleDetail> => {
    return apiRequest<HelpArticleDetail>(
        API_ENDPOINTS.ADMIN.SUPPORT.ARTICLE_DETAIL(articleId),
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );
};

const deleteArticleApi = async (articleId: string): Promise<void> => {
    return apiRequest<void>(
        API_ENDPOINTS.ADMIN.SUPPORT.ARTICLE_DETAIL(articleId),
        {
            method: "DELETE",
        },
    );
};

// --- TanStack Query Hooks ---

export const useHelpArticlesQuery = (params?: HelpArticlesParams) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.SUPPORT.ARTICLES(
            params as Record<string, unknown> | undefined,
        ),
        queryFn: () => getArticlesApi(params),
    });
};

export const useHelpArticleDetailQuery = (
    articleId: string | null | undefined,
) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.SUPPORT.ARTICLE_DETAIL(articleId as string),
        queryFn: () => getArticleDetailApi(articleId as string),
        enabled: !!articleId,
    });
};

export const useCreateHelpArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createArticleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "support", "articles"],
            });
        },
    });
};

export const useUpdateHelpArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateArticleApi,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "support", "articles"],
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ADMIN.SUPPORT.ARTICLE_DETAIL(
                    variables.articleId,
                ),
            });
        },
    });
};

export const useDeleteHelpArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteArticleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "support", "articles"],
            });
        },
    });
};