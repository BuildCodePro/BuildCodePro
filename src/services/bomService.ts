import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, BASE_URL } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth-store";
import type {
    BomLineCreatePayload,
    BomLineItem,
    BomLineRevision,
    BomLineUpdatePayload,
    BomResponse,
} from "@/types/bom";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

export type { BomLineItem, BomResponse };

export interface UpdateBomLinePricePayload {
    company_unit_price: number;
}

const LIVE_RECONNECT_BASE_MS = 1000;
const LIVE_RECONNECT_MAX_MS = 30000;

const getBomApi = async (projectId: string, includeDeleted: boolean): Promise<BomResponse> => {
    const query = includeDeleted ? "?include_deleted=true" : "";
    return apiRequest<BomResponse>(`${API_ENDPOINTS.PROJECTS.BOM.GET(projectId)}${query}`);
};

export const updateBomLineApi = async (
    projectId: string,
    lineId: string,
    payload: BomLineUpdatePayload,
): Promise<BomLineItem> =>
    apiRequest<BomLineItem>(API_ENDPOINTS.PROJECTS.BOM.LINE(projectId, lineId), {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

export const updateBomLinePriceApi = async (
    projectId: string,
    lineId: string,
    payload: UpdateBomLinePricePayload,
): Promise<BomLineItem> => updateBomLineApi(projectId, lineId, payload);

const createBomLineApi = async (projectId: string, payload: BomLineCreatePayload): Promise<BomLineItem> =>
    apiRequest<BomLineItem>(API_ENDPOINTS.PROJECTS.BOM.LINES(projectId), {
        method: "POST",
        body: JSON.stringify(payload),
    });

const deleteBomLineApi = async (projectId: string, lineId: string): Promise<BomLineItem> =>
    apiRequest<BomLineItem>(API_ENDPOINTS.PROJECTS.BOM.LINE(projectId, lineId), { method: "DELETE" });

const restoreBomLineApi = async (projectId: string, lineId: string): Promise<BomLineItem> =>
    apiRequest<BomLineItem>(API_ENDPOINTS.PROJECTS.BOM.RESTORE_LINE(projectId, lineId), { method: "POST" });

const getBomLineHistoryApi = async (projectId: string, lineId: string): Promise<BomLineRevision[]> =>
    apiRequest<BomLineRevision[]>(API_ENDPOINTS.PROJECTS.BOM.LINE_HISTORY(projectId, lineId));

export const useBomQuery = (projectId: string | null | undefined, includeDeleted = false) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.PROJECTS.BOM.GET(projectId as string), { includeDeleted }],
        queryFn: () => getBomApi(projectId as string, includeDeleted),
        enabled: !!projectId,
    });
};

export const useBomLineHistoryQuery = (projectId: string, lineId: string | null) => {
    return useQuery({
        queryKey: QUERY_KEYS.PROJECTS.BOM.LINE_HISTORY(projectId, lineId as string),
        queryFn: () => getBomLineHistoryApi(projectId, lineId as string),
        enabled: !!projectId && !!lineId,
    });
};

function useInvalidateBom(projectId: string) {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.BOM.GET(projectId) });
}

export const useUpdateBomLineMutation = (projectId: string) => {
    const invalidateBom = useInvalidateBom(projectId);
    return useMutation({
        mutationFn: ({ lineId, payload }: { lineId: string; payload: BomLineUpdatePayload }) =>
            updateBomLineApi(projectId, lineId, payload),
        onSuccess: invalidateBom,
    });
};

export const useUpdateBomLinePriceMutation = useUpdateBomLineMutation;

export const useCreateBomLineMutation = (projectId: string) => {
    const invalidateBom = useInvalidateBom(projectId);
    return useMutation({
        mutationFn: (payload: BomLineCreatePayload) => createBomLineApi(projectId, payload),
        onSuccess: invalidateBom,
    });
};

export const useDeleteBomLineMutation = (projectId: string) => {
    const invalidateBom = useInvalidateBom(projectId);
    return useMutation({
        mutationFn: (lineId: string) => deleteBomLineApi(projectId, lineId),
        onSuccess: invalidateBom,
    });
};

export const useRestoreBomLineMutation = (projectId: string) => {
    const invalidateBom = useInvalidateBom(projectId);
    return useMutation({
        mutationFn: (lineId: string) => restoreBomLineApi(projectId, lineId),
        onSuccess: invalidateBom,
    });
};

export type BomLiveStatus = "connecting" | "live" | "offline";

export function useBomLiveUpdates(projectId: string | null | undefined): BomLiveStatus {
    const queryClient = useQueryClient();
    const accessToken = useAuthStore((state) => state.accessToken);
    const [liveStatus, setLiveStatus] = useState<BomLiveStatus>("connecting");
    useEffect(() => {
        if (!projectId || !accessToken) return;
        let socket: WebSocket | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let reconnectAttempt = 0;
        let isDisposed = false;
        const connect = () => {
            const wsBase = BASE_URL.replace(/^https/, "wss").replace(/^http/, "ws");
            socket = new WebSocket(`${wsBase}${API_ENDPOINTS.PROJECTS.BOM.LIVE(projectId)}?token=${accessToken}`);
            setLiveStatus("connecting");
            socket.onopen = () => {
                reconnectAttempt = 0;
                setLiveStatus("live");
            };
            socket.onmessage = (message) => {
                try {
                    const payload = JSON.parse(message.data) as { event?: string };
                    if (payload.event === "ping") {
                        socket?.send("ping");
                        return;
                    }
                    if (payload.event?.startsWith("bom.")) {
                        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.BOM.GET(projectId) });
                    }
                } catch {
                    return;
                }
            };
            socket.onclose = () => {
                setLiveStatus("offline");
                if (isDisposed) return;
                const delay = Math.min(LIVE_RECONNECT_BASE_MS * 2 ** reconnectAttempt, LIVE_RECONNECT_MAX_MS);
                reconnectAttempt += 1;
                reconnectTimer = setTimeout(connect, delay);
            };
            socket.onerror = () => socket?.close();
        };
        connect();
        return () => {
            isDisposed = true;
            if (reconnectTimer) clearTimeout(reconnectTimer);
            socket?.close();
        };
    }, [projectId, accessToken, queryClient]);
    return liveStatus;
}
