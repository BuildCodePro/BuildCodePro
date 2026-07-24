"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { BASE_URL } from "@/lib/queryClient";
import { toast } from "sonner";

export interface AnalysisWsEvent {
    job_id: string;
    step?: string;
    current_step?: string;
    progress_pct: number;
    status: string;
    steps?: {
        key: string;
        label: string;
        status: string;
    }[];
    [key: string]: unknown;
}

export type WsConnectionStatus =
    | "idle"
    | "connecting"
    | "connected"
    | "disconnected"
    | "error";

interface UseAnalysisWebSocketOptions {
    projectId: string | null;
    jobId: string | null;
    onEvent?: (event: AnalysisWsEvent) => void;
    onComplete?: () => void;
    onError?: (error: Event | string) => void;
}

interface UseAnalysisWebSocketReturn {
    connectionStatus: WsConnectionStatus;
    latestEvent: AnalysisWsEvent | null;
    progress: number;
    currentStep: string;
    isComplete: boolean;
    disconnect: () => void;
}

function getWsBaseUrl(): string {
    return BASE_URL.replace(/^https/, "wss").replace(/^http/, "ws");
}

export function useAnalysisWebSocket({
    projectId,
    jobId,
    onEvent,
    onComplete,
    onError,
}: UseAnalysisWebSocketOptions): UseAnalysisWebSocketReturn {
    const [connectionStatus, setConnectionStatus] =
        useState<WsConnectionStatus>("idle");
    const [latestEvent, setLatestEvent] = useState<AnalysisWsEvent | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const onEventRef = useRef(onEvent);
    const onCompleteRef = useRef(onComplete);
    const onErrorRef = useRef(onError);
    onEventRef.current = onEvent;
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            console.log("[Analysis WS] Manually disconnecting");
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!projectId || !jobId) return;

        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
            console.warn("[Analysis WS] No access token - cannot connect");
            setConnectionStatus("error");
            return;
        }
        let stale = false;

        const wsBase = getWsBaseUrl();
        const wsUrl =
            wsBase +
            "/projects/" +
            projectId +
            "/analysis/jobs/" +
            jobId +
            "/ws?token=" +
            accessToken;

        console.log("[Analysis WS] Connecting to:", wsUrl);
        setConnectionStatus("connecting");

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.addEventListener("open", () => {
            if (stale) {
                ws.close();
                return;
            }
            console.log("[Analysis WS] Connected");
            setConnectionStatus("connected");
        });

        ws.addEventListener("message", (event) => {
            if (stale) return;
            let parsed: AnalysisWsEvent;
            try {
                parsed = JSON.parse(event.data as string) as AnalysisWsEvent;
            } catch {
                console.warn("[Analysis WS] Non-JSON message:", event.data);
                return;
            }
            console.log("[Analysis WS] Event:", parsed);
            setLatestEvent(parsed);
            setProgress(parsed.progress_pct ?? 0);
            setCurrentStep(parsed.current_step ?? parsed.step ?? "");
            onEventRef.current?.(parsed);
            if (parsed.status === "completed" || parsed.progress_pct >= 100) {
                console.log("[Analysis WS] Analysis complete");
                setIsComplete(true);
                setProgress(100);
                ws.close();
                toast.success("Analysis completed successfully!")
                onCompleteRef.current?.();
            }
        });

        ws.addEventListener("error", (event) => {
            if (stale) return;
            console.error("[Analysis WS] Error", event);
            toast.error("Analysis failed!")
            setConnectionStatus("error");
            onErrorRef.current?.(event);
        });

        ws.addEventListener("close", (event) => {
            if (stale) return;
            console.log("[Analysis WS] Disconnected code=" + event.code);
            setConnectionStatus("disconnected");
            wsRef.current = null;
        });

        return () => {
            stale = true;
            wsRef.current = null;
            if (ws.readyState !== WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [projectId, jobId]);

    return {
        connectionStatus,
        latestEvent,
        progress,
        currentStep,
        isComplete,
        disconnect,
    };
}
