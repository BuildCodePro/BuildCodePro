"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { BASE_URL } from "@/lib/queryClient";
import { toast } from "sonner";

export interface AnalysisWsEvent {
    job_id: string;
    event?: string; // e.g. "started", "progress", "completed"
    message?: string; // human-readable status text, e.g. "Analysis started."
    step?: string;
    current_step?: string;
    progress_pct: number;
    status: string;
    snapshot?: boolean;
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
    isRetry?: boolean;
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

/**
 * Safely close a WebSocket.
 *
 * Calling .close() while the socket is still CONNECTING can produce:
 *
 * "WebSocket is closed before the connection is established."
 *
 * So if the socket is CONNECTING, wait for OPEN and close it immediately.
 */
function safeCloseSocket(ws: WebSocket) {
    switch (ws.readyState) {
        case WebSocket.CONNECTING:
            ws.addEventListener(
                "open",
                () => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.close();
                    }
                },
                { once: true },
            );
            break;

        case WebSocket.OPEN:
            ws.close();
            break;

        case WebSocket.CLOSING:
        case WebSocket.CLOSED:
        default:
            break;
    }
}

/* ------------------------------------------------------------------------
 * Shared WebSocket connection registry
 *
 * IMPORTANT:
 *
 * We intentionally keep ONE active listener per shared WebSocket.
 *
 * The previous implementation used:
 *
 *     Set<ConnectionListener>
 *
 * which allowed the same WebSocket to have multiple React hook listeners.
 *
 * React StrictMode can mount/unmount/remount effects in development.
 * Fast Refresh and component remounts can also cause this.
 *
 * Result:
 *
 *     One backend event
 *          ↓
 *     same WebSocket
 *          ↓
 *     listener #1
 *     listener #2
 *
 * Therefore the same event was processed twice.
 *
 * This implementation keeps ONE WebSocket and ONE active listener.
 * The listener's callbacks are updated instead of adding another listener.
 * ---------------------------------------------------------------------- */

interface ConnectionCallbacks {
    onOpen: () => void;
    onMessage: (event: AnalysisWsEvent) => void;
    onError: (event: Event) => void;
    onClose: (event: CloseEvent) => void;
}

interface SharedConnection {
    ws: WebSocket;

    /**
     * Only ONE logical listener is attached to a shared connection.
     */
    listener: ConnectionCallbacks;

    /**
     * Number of hook consumers currently using this connection.
     *
     * We keep this as a reference count so a temporary React remount
     * does not immediately destroy the socket.
     */
    refCount: number;

    closeTimer: ReturnType<typeof setTimeout> | null;
}

const REGISTRY_GLOBAL_KEY = "__analysisWsConnectionRegistry__";

function getGlobalRegistry(): Map<string, SharedConnection> {
    const g = globalThis as unknown as Record<string, unknown>;

    if (!g[REGISTRY_GLOBAL_KEY]) {
        g[REGISTRY_GLOBAL_KEY] =
            new Map<string, SharedConnection>();
    }

    return g[REGISTRY_GLOBAL_KEY] as Map<
        string,
        SharedConnection
    >;
}

const connectionRegistry = getGlobalRegistry();

const CLOSE_GRACE_MS = 250;

/**
 * Create or reuse a shared WebSocket.
 *
 * If the connection already exists:
 *
 * - DO NOT create another WebSocket
 * - DO NOT attach another browser message listener
 * - update the existing callback reference
 * - increment refCount
 */
function getOrCreateConnection(
    key: string,
    url: string,
    callbacks: ConnectionCallbacks,
): SharedConnection {
    const existing = connectionRegistry.get(key);

    if (
        existing &&
        (existing.ws.readyState === WebSocket.OPEN ||
            existing.ws.readyState === WebSocket.CONNECTING)
    ) {
        console.log(
            "[Analysis WS] Reusing existing shared connection:",
            key,
        );

        if (existing.closeTimer) {
            clearTimeout(existing.closeTimer);
            existing.closeTimer = null;
        }

        /**
         * IMPORTANT:
         *
         * We replace callbacks instead of adding another listener.
         *
         * This is the main fix for duplicate events.
         */
        existing.listener = callbacks;

        existing.refCount += 1;

        if (existing.ws.readyState === WebSocket.OPEN) {
            callbacks.onOpen();
        }

        return existing;
    }

    console.log(
        "[Analysis WS] Opening new connection:",
        key,
        "(registry size before open:",
        connectionRegistry.size,
        ")",
    );

    const ws = new WebSocket(url);

    const entry: SharedConnection = {
        ws,
        listener: callbacks,
        refCount: 1,
        closeTimer: null,
    };

    connectionRegistry.set(key, entry);

    /**
     * Only ONE browser "open" listener.
     */
    ws.addEventListener("open", () => {
        /**
         * Make sure this connection is still the active registry entry.
         */
        if (connectionRegistry.get(key) !== entry) {
            return;
        }

        entry.listener.onOpen();
    });

    /**
     * Only ONE browser "message" listener.
     */
    ws.addEventListener("message", (event) => {
        /**
         * Ignore messages from an obsolete connection.
         */
        if (connectionRegistry.get(key) !== entry) {
            return;
        }

        let parsed: AnalysisWsEvent;

        try {
            parsed = JSON.parse(
                event.data as string,
            ) as AnalysisWsEvent;
        } catch {
            console.warn(
                "[Analysis WS] Non-JSON message:",
                event.data,
            );

            return;
        }

        /**
         * IMPORTANT:
         *
         * Exactly ONE callback execution.
         */
        entry.listener.onMessage(parsed);
    });

    /**
     * Only ONE browser "error" listener.
     */
    ws.addEventListener("error", (event) => {
        /**
         * Ignore events from obsolete sockets.
         */
        if (connectionRegistry.get(key) !== entry) {
            return;
        }

        entry.listener.onError(event);
    });

    /**
     * Only ONE browser "close" listener.
     */
    ws.addEventListener("close", (event) => {
        /**
         * Do not let an old socket change the state of a newer socket.
         */
        if (connectionRegistry.get(key) !== entry) {
            return;
        }

        entry.listener.onClose(event);
    });

    return entry;
}

/**
 * Release one consumer of the shared connection.
 *
 * We don't immediately close the socket because React StrictMode
 * can temporarily unsubscribe and subscribe again.
 */
function releaseConnection(
    key: string,
    force = false,
) {
    const entry = connectionRegistry.get(key);

    if (!entry) {
        return;
    }

    if (force) {
        if (entry.closeTimer) {
            clearTimeout(entry.closeTimer);
            entry.closeTimer = null;
        }

        /**
         * Remove the connection from registry first so old socket
         * events cannot affect a future connection.
         */
        if (connectionRegistry.get(key) === entry) {
            connectionRegistry.delete(key);
        }

        entry.refCount = 0;

        safeCloseSocket(entry.ws);

        return;
    }

    /**
     * Prevent negative reference count.
     */
    if (entry.refCount > 0) {
        entry.refCount -= 1;
    }

    /**
     * Other consumers are still using this socket.
     */
    if (entry.refCount > 0) {
        return;
    }

    /**
     * Grace period for StrictMode / quick remount.
     */
    if (entry.closeTimer) {
        clearTimeout(entry.closeTimer);
    }

    entry.closeTimer = setTimeout(() => {
        const stillTracked = connectionRegistry.get(key);

        /**
         * A new consumer may have re-subscribed during the grace period.
         */
        if (
            stillTracked !== entry ||
            entry.refCount > 0
        ) {
            return;
        }

        connectionRegistry.delete(key);

        entry.closeTimer = null;

        safeCloseSocket(entry.ws);
    }, CLOSE_GRACE_MS);
}

export function useAnalysisWebSocket({
    projectId,
    isRetry,
    onEvent,
    onComplete,
    onError,
}: UseAnalysisWebSocketOptions): UseAnalysisWebSocketReturn {
    const [connectionStatus, setConnectionStatus] =
        useState<WsConnectionStatus>("idle");

    const [latestEvent, setLatestEvent] =
        useState<AnalysisWsEvent | null>(null);

    const [progress, setProgress] = useState(0);

    const [currentStep, setCurrentStep] =
        useState("");

    const [isComplete, setIsComplete] =
        useState(false);

    /**
     * Always keep latest callbacks.
     *
     * This prevents the shared socket from calling stale React callbacks.
     */
    const onEventRef = useRef(onEvent);
    const onCompleteRef = useRef(onComplete);
    const onErrorRef = useRef(onError);

    onEventRef.current = onEvent;
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;

    /**
     * Prevent completion side effects from happening more than once
     * for this hook lifecycle.
     */
    const hasCompletedRef = useRef(false);

    const currentKeyRef =
        useRef<string | null>(null);

    /**
     * Used to identify this hook's active subscription.
     *
     * This prevents an old cleanup from accidentally disconnecting
     * a newer subscription.
     */
    const subscriptionIdRef = useRef(0);

    const disconnect = useCallback(() => {
        const key = currentKeyRef.current;

        if (!key) {
            return;
        }

        console.log(
            "[Analysis WS] Manually disconnecting:",
            key,
        );

        releaseConnection(key, true);

        currentKeyRef.current = null;
    }, []);

    useEffect(() => {
        if (!projectId) {
            return;
        }

        const accessToken =
            useAuthStore.getState().accessToken;

        if (!accessToken) {
            console.warn(
                "[Analysis WS] No access token - cannot connect",
            );

            setConnectionStatus("error");

            return;
        }

        /**
         * New subscription.
         */
        subscriptionIdRef.current += 1;

        const subscriptionId =
            subscriptionIdRef.current;

        hasCompletedRef.current = false;

        const endpoint = isRetry
            ? "/analysis/retry/ws"
            : "/analysis/ws";

        /**
         * Normal analysis and retry analysis intentionally
         * use different connection keys.
         */
        const key = `${projectId}:${endpoint}`;

        currentKeyRef.current = key;

        const wsBase = getWsBaseUrl();

        const wsUrl =
            wsBase +
            "/projects/" +
            projectId +
            endpoint +
            "?token=" +
            accessToken;

        console.log(
            "[Analysis WS] Subscribing:",
            {
                key,
                subscriptionId,
            },
        );

        setConnectionStatus("connecting");

        const callbacks: ConnectionCallbacks = {
            onOpen: () => {
                /**
                 * Make sure this hook subscription is still current.
                 */
                if (
                    currentKeyRef.current !== key ||
                    subscriptionIdRef.current !==
                    subscriptionId
                ) {
                    return;
                }

                console.log(
                    "[Analysis WS] Connected",
                );

                setConnectionStatus("connected");
            },

            onMessage: (parsed) => {
                /**
                 * Ignore events if this subscription is no longer current.
                 */
                if (
                    currentKeyRef.current !== key ||
                    subscriptionIdRef.current !==
                    subscriptionId
                ) {
                    return;
                }

                console.log(
                    "[Analysis WS] Event:",
                    parsed,
                );

                setLatestEvent(parsed);

                const progressPct = parsed.progress_pct ?? 0;

                /**
                 * Backend sends progress_pct: 0 when analysis fails.
                 *
                 * Don't make the progress UI jump from the last real
                 * progress value back to 0%.
                 */
                if (parsed.status !== "failed") {
                    setProgress(progressPct);
                }

                setCurrentStep(
                    parsed.current_step ??
                    parsed.step ??
                    "",
                );

                onEventRef.current?.(parsed);



                const completed =
                    parsed.status === "completed" ||
                    progressPct >= 100;

                if (
                    !hasCompletedRef.current &&
                    completed
                ) {
                    hasCompletedRef.current = true;

                    console.log(
                        "[Analysis WS] Analysis complete",
                    );

                    setIsComplete(true);

                    setProgress(100);

                    toast.success(
                        "Analysis completed successfully!",
                    );

                    onCompleteRef.current?.();

                    /**
                     * Completion means this analysis no longer
                     * needs a WebSocket.
                     *
                     * Force closes the shared connection.
                     */
                    releaseConnection(
                        key,
                        true,
                    );

                    if (
                        currentKeyRef.current ===
                        key
                    ) {
                        currentKeyRef.current =
                            null;
                    }
                }
            },

            onError: (event) => {
                /**
                 * Ignore stale socket errors.
                 */
                if (
                    currentKeyRef.current !== key ||
                    subscriptionIdRef.current !==
                    subscriptionId
                ) {
                    return;
                }

                console.error(
                    "[Analysis WS] Error",
                    event,
                );

                /**
                 * Don't show an error after the analysis
                 * has already completed.
                 */
                if (
                    !hasCompletedRef.current
                ) {
                    toast.error(
                        "Analysis failed!",
                    );

                    setConnectionStatus(
                        "error",
                    );

                    onErrorRef.current?.(event);
                }
            },

            onClose: (event) => {
                /**
                 * Ignore close events from old connections.
                 */
                if (
                    currentKeyRef.current !== key ||
                    subscriptionIdRef.current !==
                    subscriptionId
                ) {
                    return;
                }

                console.log(
                    "[Analysis WS] Disconnected code=" +
                    event.code,
                );

                setConnectionStatus(
                    "disconnected",
                );
            },
        };

        /**
         * Create/reuse ONE shared WebSocket.
         */
        getOrCreateConnection(
            key,
            wsUrl,
            callbacks,
        );

        return () => {
            /**
             * IMPORTANT:
             *
             * Only release the connection if this cleanup belongs
             * to the current subscription.
             */
            if (
                subscriptionIdRef.current !==
                subscriptionId
            ) {
                return;
            }

            console.log(
                "[Analysis WS] Cleaning up subscription:",
                {
                    key,
                    subscriptionId,
                },
            );

            releaseConnection(key);

            if (
                currentKeyRef.current === key
            ) {
                currentKeyRef.current = null;
            }
        };
    }, [projectId, isRetry]);

    return {
        connectionStatus,
        latestEvent,
        progress,
        currentStep,
        isComplete,
        disconnect,
    };
}