"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { getAnalysisInputRows } from "@/lib/utils/format-analysis-inputs";
import type { ProjectInfoFormData, UploadedFile } from "@/types/new-design";

import { AnalysisInputsPanel } from "./analysis-inputs-panel";
import { AnalysisProgressTasks } from "./analysis-progress-tasks";
import { useAnalysisProgress } from "./use-analysis-progress";

interface AiAnalysisStepProps {
  files: UploadedFile[];
  projectInfo: ProjectInfoFormData;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function AiAnalysisStep({
  files,
  projectInfo,
  onComplete,
  onCancel,
}: AiAnalysisStepProps) {
  const { tasks, progress, isRunning, isComplete, cancel } = useAnalysisProgress({
    onComplete,
  });

  const inputRows = useMemo(
    () => getAnalysisInputRows(files, projectInfo),
    [files, projectInfo],
  );

  const handleCancel = () => {
    cancel();
    onCancel?.();
  };

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
              {isComplete
                ? "Analysis complete"
                : "Analyzing your drawings..."}
            </h2>
            <p className="font-body text-sm leading-relaxed text-stat-label">
              Our AI engine is processing your construction drawings and applying
              NFPA 72 compliance rules to generate an accurate fire alarm
              design.
            </p>
          </div>

          <CircularProgress value={progress} progressClassName="text-ai-cyan" />

          <AnalysisProgressTasks tasks={tasks} className="w-full max-w-xl" />
        </CardContent>
      </Card>

      <AnalysisInputsPanel
        rows={inputRows}
        onCancel={handleCancel}
        isCancelling={!isRunning && !isComplete}
      />
    </div>
  );
}
