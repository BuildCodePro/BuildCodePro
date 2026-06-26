"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ANALYSIS_PROGRESS_MILESTONES,
  ANALYSIS_TASK_DURATION_MS,
  ANALYSIS_TASKS,
} from "@/lib/constants/ai-analysis";
import type { AnalysisTaskState } from "@/types/new-design";

interface UseAnalysisProgressOptions {
  onComplete?: () => void;
  taskDurationMs?: number;
}

export function useAnalysisProgress({
  onComplete,
  taskDurationMs = ANALYSIS_TASK_DURATION_MS,
}: UseAnalysisProgressOptions = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tasks: AnalysisTaskState[] = ANALYSIS_TASKS.map((task, index) => {
    if (isComplete || index < activeIndex) {
      return { ...task, status: "completed" };
    }

    if (index === activeIndex && isRunning) {
      return { ...task, status: "active" };
    }

    return { ...task, status: "pending" };
  });

  useEffect(() => {
    if (!isRunning || isComplete) {
      return;
    }

    const target = ANALYSIS_PROGRESS_MILESTONES[activeIndex] ?? 100;

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= target) {
          return current;
        }

        return Math.min(target, current + 1);
      });
    }, 30);

    return () => window.clearInterval(interval);
  }, [activeIndex, isComplete, isRunning]);

  useEffect(() => {
    if (!isRunning || isComplete) {
      return;
    }

    if (activeIndex >= ANALYSIS_TASKS.length) {
      setProgress(100);
      setIsComplete(true);
      setIsRunning(false);
      onCompleteRef.current?.();
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => index + 1);
    }, taskDurationMs);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isComplete, isRunning, taskDurationMs]);

  const cancel = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    tasks,
    progress,
    isRunning,
    isComplete,
    cancel,
  };
}
