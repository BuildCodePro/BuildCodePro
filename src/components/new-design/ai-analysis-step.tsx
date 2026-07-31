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

import { AnalysisInputsPanel } from "./analysis-inputs-panel";
import { AnalysisProgressTasks } from "./analysis-progress-tasks";
import { useAnalysisWebSocket, type AnalysisWsEvent } from "./use-analysis-websocket";
import { useCancelAiAnalysis, useRetryAiAnalysis } from "@/services/analysisResultsService";
import { toast } from "sonner";

interface AiAnalysisStepProps {
  files: UploadedFile[];
  projectInfo: ProjectInfoFormData;
  projectId: string | null;
  jobId: string | null;
  onComplete?: () => void;
  onCancel?: () => void;
}

type AnalysisLifecycleStatus =
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

// Structured API error payload, e.g.:
// { error_code: "ANALYSIS_NOT_RETRYABLE", message: "...", timestamp: "..." }
interface ApiErrorPayload {
  error_code?: string;
  message?: string;
  timestamp?: string;
}

function extractApiErrorPayload(error: any): ApiErrorPayload | null {
  if (!error) return null;

  const candidate =
    error?.data ??
    error?.response?.data ??
    (typeof error === "object" ? error : null);

  if (candidate && typeof candidate === "object" && "message" in candidate) {
    return candidate as ApiErrorPayload;
  }

  return null;
}

function getErrorMessage(error: any, fallback: string): string {
  const payload = extractApiErrorPayload(error);
  if (payload?.message) return payload.message;
  if (error instanceof Error && error.message) return error.message;
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
  const [targetTasks, setTargetTasks] = useState<AnalysisTaskState[]>([]);
  const [displayTasks, setDisplayTasks] = useState<AnalysisTaskState[]>([]);

  const [analysisStatus, setAnalysisStatus] =
    useState<AnalysisLifecycleStatus>("running");

  useEffect(() => {
    if (jobId) {
      setAnalysisStatus("running");
    }
  }, [jobId]);

  const handleEvent = (event: AnalysisWsEvent) => {
    if (event.steps && Array.isArray(event.steps)) {
      setTargetTasks(
        event.steps.map((s) => ({
          id: s.key,
          label: s.label,
          status:
            s.status === "completed"
              ? "completed"
              : s.status === "in_progress"
                ? "active"
                : "pending",
        }))
      );
    } else {
      const label = (event.current_step || event.step)?.trim();
      if (!label) return;

      setTargetTasks((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].label === label) {
          return prev;
        }
        return [
          ...prev.map((t) => ({ ...t, status: "completed" as const })),
          { id: `${prev.length}-${label}`, label, status: "active" as const },
        ];
      });
    }
  };

  useEffect(() => {
    if (targetTasks.length === 0) return;

    const nextDisplay = displayTasks.length > 0 ? [...displayTasks] : targetTasks.map(t => ({ ...t, status: "pending" as const }));
    let changed = false;

    for (let i = 0; i < targetTasks.length; i++) {
      const target = targetTasks[i];
      const current = nextDisplay[i];

      if (!current) {
        nextDisplay[i] = { ...target, status: "pending" };
        changed = true;
        break;
      }

      if (current.status !== target.status) {
        if (current.status === "pending") {
          nextDisplay[i] = { ...current, status: "active" };
          changed = true;
          break;
        } else if (current.status === "active" && target.status === "completed") {
          nextDisplay[i] = { ...current, status: "completed" };
          changed = true;
          break;
        }
      }
    }

    if (changed) {
      const timer = setTimeout(() => setDisplayTasks(nextDisplay), 400);
      return () => clearTimeout(timer);
    } else if (displayTasks.length !== nextDisplay.length) {
      setDisplayTasks(nextDisplay);
    }
  }, [targetTasks, displayTasks]);

  const { progress, isComplete, connectionStatus, disconnect } =
    useAnalysisWebSocket({
      projectId,
      jobId,
      onEvent: handleEvent,
      onComplete: () => {
        setAnalysisStatus("completed");
        onComplete?.();
      },
      onError: (err) => {
        console.error("[AiAnalysisStep] WebSocket error:", err);
        setAnalysisStatus("failed");
      },
    });

  const finalDisplayTasks = isComplete
    ? displayTasks.map((t) => ({ ...t, status: "completed" as const }))
    : displayTasks;

  const inputRows = useMemo(
    () => getAnalysisInputRows(files, projectInfo),
    [files, projectInfo],
  );

  const cancelAnalysis = useCancelAiAnalysis(projectId ?? "", jobId ?? "");
  const retryAnalysis = useRetryAiAnalysis(projectId ?? "", jobId ?? "");

  const handleCancel = () => {
    // disconnect();
    cancelAnalysis.mutate(undefined, {
      onSuccess: () => {
        setAnalysisStatus("cancelled");
        toast.success("AI Analysis cancelled successfully.");
        onCancel?.();
      },
      onError: (error: any) => {
        toast.error(getErrorMessage(error, "Failed to cancel analysis."));
      },
    });
  };

  const retryAi = () => {
    // disconnect();
    retryAnalysis.mutate(undefined, {
      onSuccess: () => {
        setAnalysisStatus("running");
        toast.success("AI Analysis retry started successfully.");
      },
      onError: (error: any) => {
        const payload = extractApiErrorPayload(error);
        const message = getErrorMessage(
          error,
          "Failed to retry analysis. Please try again.",
        );

        if (payload?.error_code === "ANALYSIS_NOT_RETRYABLE") {
          toast.error(message);
          return;
        }

        toast.error(message);
      },
    });
  };

  const isRunning =
    (connectionStatus === "connecting" || connectionStatus === "connected") &&
    analysisStatus === "running";

  // Retry is only meaningful once the job has actually stopped in a
  // non-successful way (failed or cancelled) — never while it's running
  // or already completed, since the backend rejects those with
  // ANALYSIS_NOT_RETRYABLE.
  const canRetry =
    analysisStatus === "failed" || analysisStatus === "cancelled";

  const canCancel = isRunning;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-ai-cyan/30 bg-ai-cyan/10 px-4 py-1.5 font-body text-sm font-medium text-ai-cyan">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {isComplete ? "AI Analysis Complete" : "AI Analysis Running"}
          </span>

          <div className="max-w-lg space-y-2 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {isComplete ? "Analysis complete" : "Analyzing your drawings..."}
            </h2>
            <p className="font-body text-sm leading-relaxed text-stat-label">
              Our AI engine is processing your construction drawings and applying
              NFPA 72 compliance rules to generate an accurate fire alarm design.
            </p>
          </div>

          <CircularProgress value={progress} progressClassName="text-ai-cyan" />

          {finalDisplayTasks.length > 0 ? (
            <AnalysisProgressTasks tasks={finalDisplayTasks} className="w-full max-w-xl" />
          ) : (
            <p className="font-body text-sm text-stat-label">
              Waiting for analysis to start…
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