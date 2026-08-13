"use client";

import { useMemo, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { getAnalysisInputRows } from "@/lib/utils/format-analysis-inputs";

import type {
  AnalysisTaskState,
  ProjectInfoFormData,
  UploadedFile,
} from "@/types/new-design";

import {
  AnalysisProgressTasks,
  AnalysisStepTask,
} from "./analysis-progress-tasks";

import {
  useAnalysisWebSocket,
  type AnalysisWsEvent,
} from "./use-analysis-websocket";

import {
  useCancelAiAnalysis,
  useRetryAiAnalysis,
} from "@/services/analysisResultsService";

import { toast } from "sonner";
import { AnalysisInputsPanel } from "./analysis-inputs-panel";

interface AiAnalysisStepProps {
  files: UploadedFile[];
  projectInfo: ProjectInfoFormData;
  projectId: string | null;

  /**
   * Kept because cancel/retry APIs currently use jobId.
   * It is NOT used by the WebSocket event handling anymore.
   */
  jobId: string | null;

  onComplete?: () => void;
  onCancel?: () => void;
}

type AnalysisLifecycleStatus =
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

interface ApiErrorPayload {
  error_code?: string;
  message?: string;
  timestamp?: string;
}

function extractApiErrorPayload(
  error: any,
): ApiErrorPayload | null {
  if (!error) return null;

  const candidate =
    error?.data ??
    error?.response?.data ??
    (typeof error === "object" ? error : null);

  if (
    candidate &&
    typeof candidate === "object" &&
    "message" in candidate
  ) {
    return candidate as ApiErrorPayload;
  }

  return null;
}

function toAnalysisStepTasks(
  tasks: AnalysisTaskState[],
): AnalysisStepTask[] {
  return tasks.map((task) => ({
    id: task.id,
    label: task.label,
    status:
      task.status === "active"
        ? "in_progress"
        : task.status,
  }));
}

function getErrorMessage(
  error: any,
  fallback: string,
): string {
  const payload = extractApiErrorPayload(error);

  if (payload?.message) {
    return payload.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function AiAnalysisStep({
  files,
  projectInfo,
  projectId,
  jobId,
  onComplete,
  onCancel,
}: AiAnalysisStepProps) {
  const [targetTasks, setTargetTasks] =
    useState<AnalysisTaskState[]>([]);

  const [displayTasks, setDisplayTasks] =
    useState<AnalysisTaskState[]>([]);

  const [isRetryState, setIsRetryState] =
    useState(false);

  const [analysisStatus, setAnalysisStatus] =
    useState<AnalysisLifecycleStatus>("running");

  /**
   * ---------------------------------------------------------
   * Handle WebSocket events
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * job_id is NOT required for displaying analysis progress.
   *
   * UI is driven by:
   *
   * - progress_pct
   * - steps
   * - current_step
   * - step
   * - message
   * - status
   */
  const handleEvent = (event: AnalysisWsEvent) => {
    console.log(
      "[AiAnalysisStep] WebSocket event:",
      event,
    );

    /**
     * Backend explicitly reported failure.
     *
     * IMPORTANT:
     * Do not let failed progress_pct: 0 make the UI
     * visually jump back to 0%.
     */
    if (event.status === "failed") {
      setAnalysisStatus("failed");

      /**
       * Keep the last successful progress value.
       *
       * Do NOT update progress here because the backend
       * sends progress_pct: 0 on failure.
       */

      /**
       * If backend sends "failed" as current_step,
       * don't create a task called "failed".
       */
      return;
    }

    /**
     * -------------------------------------------------------
     * Steps array
     * -------------------------------------------------------
     */
    if (
      Array.isArray(event.steps) &&
      event.steps.length > 0
    ) {
      const nextTasks: AnalysisTaskState[] =
        event.steps.map((step) => ({
          id: step.key,
          label: step.label,
          status:
            step.status === "completed"
              ? "completed"
              : step.status === "in_progress"
                ? "active"
                : "pending",
        }));

      setTargetTasks(nextTasks);

      return;
    }

    /**
     * -------------------------------------------------------
     * Current step / step
     * -------------------------------------------------------
     */
    const label = (
      event.current_step ??
      event.step ??
      ""
    ).trim();

    /**
     * Don't create a task named "failed".
     */
    if (
      !label ||
      label.toLowerCase() === "failed"
    ) {
      return;
    }

    setTargetTasks((prev) => {
      /**
       * Same step received again.
       */
      if (
        prev.length > 0 &&
        prev[prev.length - 1].label === label
      ) {
        return prev;
      }

      /**
       * Previous active step → completed.
       * New step → active.
       */
      return [
        ...prev.map((task) => ({
          ...task,
          status: "completed" as const,
        })),

        {
          id: `${prev.length}-${label}`,
          label,
          status: "active" as const,
        },
      ];
    });
  };

  /**
   * ---------------------------------------------------------
   * Animate task display
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (targetTasks.length === 0) {
      return;
    }

    const nextDisplay =
      displayTasks.length > 0
        ? [...displayTasks]
        : targetTasks.map((task) => ({
          ...task,
          status: "pending" as const,
        }));

    let changed = false;

    for (
      let index = 0;
      index < targetTasks.length;
      index++
    ) {
      const target = targetTasks[index];
      const current = nextDisplay[index];

      if (!current) {
        nextDisplay[index] = {
          ...target,
          status: "pending",
        };

        changed = true;
        break;
      }

      if (current.status !== target.status) {
        /**
         * pending → active
         */
        if (current.status === "pending") {
          nextDisplay[index] = {
            ...current,
            status: "active",
          };

          changed = true;
          break;
        }

        /**
         * active → completed
         */
        if (
          current.status === "active" &&
          target.status === "completed"
        ) {
          nextDisplay[index] = {
            ...current,
            status: "completed",
          };

          changed = true;
          break;
        }
      }
    }

    if (changed) {
      const timer = setTimeout(() => {
        setDisplayTasks(nextDisplay);
      }, 400);

      return () => clearTimeout(timer);
    }

    if (
      displayTasks.length !==
      nextDisplay.length
    ) {
      setDisplayTasks(nextDisplay);
    }
  }, [targetTasks, displayTasks]);

  /**
   * ---------------------------------------------------------
   * WebSocket
   * ---------------------------------------------------------
   */
  const {
    progress,
    isComplete,
    connectionStatus,
    latestEvent,
    disconnect,
  } = useAnalysisWebSocket({
    projectId,
    isRetry: isRetryState,

    onEvent: handleEvent,

    onComplete: () => {
      setAnalysisStatus("completed");
      onComplete?.();
    },

    onError: (error) => {
      console.error(
        "[AiAnalysisStep] WebSocket error:",
        error,
      );

      setAnalysisStatus("failed");
    },
  });

  /**
   * ---------------------------------------------------------
   * Final tasks
   * ---------------------------------------------------------
   */
  const finalDisplayTasks = isComplete
    ? displayTasks.map((task) => ({
      ...task,
      status: "completed" as const,
    }))
    : displayTasks;

  /**
   * ---------------------------------------------------------
   * Status message
   * ---------------------------------------------------------
   *
   * Prefer backend message.
   */
  const statusMessage =
    latestEvent?.message ||
    (connectionStatus === "connecting"
      ? "Connecting to analysis engine…"
      : connectionStatus === "connected"
        ? "Starting analysis…"
        : "Waiting for analysis to start…");

  /**
   * ---------------------------------------------------------
   * Input rows
   * ---------------------------------------------------------
   */
  const inputRows = useMemo(
    () =>
      getAnalysisInputRows(
        files,
        projectInfo,
      ),
    [files, projectInfo],
  );

  /**
   * ---------------------------------------------------------
   * Cancel / Retry
   * ---------------------------------------------------------
   *
   * jobId is still passed here because the current
   * service signatures require it.
   */
  const cancelAnalysis =
    useCancelAiAnalysis(
      projectId ?? "",
      jobId ?? "",
    );

  const retryAnalysis =
    useRetryAiAnalysis(
      projectId ?? "",
      jobId ?? "",
    );

  /**
   * ---------------------------------------------------------
   * Cancel
   * ---------------------------------------------------------
   */
  const handleCancel = () => {
    cancelAnalysis.mutate(undefined, {
      onSuccess: () => {
        disconnect();

        setAnalysisStatus("cancelled");

        toast.success(
          "AI Analysis cancelled successfully.",
        );

        onCancel?.();
      },

      onError: (error: any) => {
        toast.error(
          getErrorMessage(
            error,
            "Failed to cancel analysis.",
          ),
        );
      },
    });
  };

  /**
   * ---------------------------------------------------------
   * Retry
   * ---------------------------------------------------------
   */
  const retryAi = () => {
    /**
     * Fresh retry run.
     */
    setIsRetryState(true);

    setTargetTasks([]);

    setDisplayTasks([]);

    setAnalysisStatus("running");

    /**
     * Disconnect old analysis socket.
     * useAnalysisWebSocket will reconnect to:
     *
     * /analysis/retry/ws
     */
    disconnect();
  };

  /**
   * ---------------------------------------------------------
   * Running state
   * ---------------------------------------------------------
   */
  const isRunning =
    (
      connectionStatus === "connecting" ||
      connectionStatus === "connected"
    ) &&
    analysisStatus === "running";

  /**
   * Retry only after failed/cancelled.
   */
  const canRetry =
    analysisStatus === "failed" ||
    analysisStatus === "cancelled";

  const canCancel = isRunning;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-ai-cyan/30 bg-ai-cyan/10 px-4 py-1.5 font-body text-sm font-medium text-ai-cyan">
            <Sparkles
              className="size-3.5"
              aria-hidden="true"
            />

            {isComplete
              ? "AI Analysis Complete"
              : "AI Analysis Running"}
          </span>

          <div className="max-w-lg space-y-2 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {isComplete
                ? "Analysis complete"
                : "Analyzing your drawings..."}
            </h2>

            <p className="font-body text-sm leading-relaxed text-stat-label">
              Our AI engine is processing your
              construction drawings and applying
              NFPA 72 compliance rules to generate
              an accurate fire alarm design.
            </p>
          </div>

          <CircularProgress
            value={progress}
            progressClassName="text-ai-cyan"
          />

          {finalDisplayTasks.length > 0 ? (
            <>
              <AnalysisProgressTasks
                tasks={toAnalysisStepTasks(
                  finalDisplayTasks,
                )}
                className="w-full max-w-xl"
              />

              {statusMessage ? (
                <p className="font-body text-xs text-stat-label/70">
                  {statusMessage}
                </p>
              ) : null}
            </>
          ) : (
            <p className="font-body text-sm text-stat-label animate-pulse">
              {statusMessage}
            </p>
          )}
        </CardContent>
      </Card>

      <AnalysisInputsPanel
        rows={inputRows}
        retryAi={retryAi}
        onCancel={handleCancel}
        canRetry={canRetry}
        canCancel={canCancel}
        isRetrying={retryAnalysis.isPending}
        isCancelling={cancelAnalysis.isPending}
      />
    </div>
  );
}