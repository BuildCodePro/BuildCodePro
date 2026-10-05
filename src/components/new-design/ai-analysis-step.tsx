"use client";

import { useMemo, useState, useEffect } from "react";
import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
import { EngineCalculationCards } from "./engine-calculation-cards";
import { useGetComplianceChecklistQuery } from "@/services/analysisResultsService";

interface AiAnalysisStepProps {
  files: UploadedFile[];
  projectInfo: ProjectInfoFormData;
  projectId: string | null;

  /**
   * Kept because cancel/retry APIs currently use jobId.
   * It is NOT used by the WebSocket event handling anymore.
   */
  jobId: string | null;

  /**
   * True only when the user just clicked "Confirm and Calculate".
   * Otherwise the step watches the latest job and never starts a new run.
   */
  startNewRun?: boolean;

  /**
   * Called once the backend confirms the new run, so a remount
   * or reconnect watches it instead of starting another one.
   */
  onRunStarted?: () => void;

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
  startNewRun = false,
  onRunStarted,
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

    if (startNewRun && event.job_id) {
      onRunStarted?.();
    }

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
    watchOnly: !startNewRun && !isRetryState,

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
  const failureMessage =
    analysisStatus === "failed"
      ? latestEvent?.error_message || latestEvent?.message || "The analysis failed. Retry to run it again."
      : null;

  const statusMessage =
    failureMessage ||
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

  const complianceQuery = useGetComplianceChecklistQuery(
    isComplete && projectId ? projectId : undefined,
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
      <Card>
        <CardContent className="flex flex-col gap-5 py-6">
          <div className="flex items-start gap-3">
            {isComplete ? (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                <Check className="size-5 text-success" aria-hidden="true" />
              </span>
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                {progress}%
              </span>
            )}
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {isComplete ? "Extraction complete" : failureMessage ? "Analysis failed" : "AI analysis"}
              </h2>
              <p className="font-body text-sm text-stat-label">
                {isComplete
                  ? "Building context is ready for the calculation engine."
                  : "The model classifies the drawings. It does not invent battery or voltage-drop math."}
              </p>
            </div>
          </div>
          {finalDisplayTasks.length > 0 ? (
            <AnalysisProgressTasks
              tasks={toAnalysisStepTasks(finalDisplayTasks)}
              className="w-full"
            />
          ) : (
            <p className="font-body text-sm text-stat-label animate-pulse">
              {statusMessage}
            </p>
          )}
          {statusMessage && finalDisplayTasks.length > 0 ? (
            <p className="font-body text-xs text-stat-label/70">{statusMessage}</p>
          ) : null}
          <p className="font-body text-xs text-stat-label">AI analysis</p>
        </CardContent>
      </Card>

      <EngineCalculationCards
        isComplete={isComplete}
        calculations={complianceQuery.data?.calculations}
      />

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