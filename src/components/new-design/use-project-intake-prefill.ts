import { useEffect, useRef, useState } from "react";

import { applyIntakeToProjectInfo } from "@/lib/utils/project-intake";
import { useProjectIntake, useRetryProjectIntakeMutation } from "@/services/projectIntakeService";
import type { ProjectInfoFormData } from "@/types/new-design";
import type { IntakeFieldSource } from "@/types/project-intake";

export function useProjectIntakePrefill(
  projectId: string | null,
  projectInfo: ProjectInfoFormData,
  setProjectInfo: (projectInfo: ProjectInfoFormData) => void,
) {
  const { intake, activity } = useProjectIntake(projectId);
  const retryMutation = useRetryProjectIntakeMutation(projectId);
  const [fieldSources, setFieldSources] = useState<Partial<Record<keyof ProjectInfoFormData, IntakeFieldSource>>>({});
  const appliedIntakeKey = useRef<string | null>(null);
  useEffect(() => {
    if (intake?.status !== "ready" || !intake.result) return;
    const intakeKey = `${intake.project_id}:${intake.updated_at}`;
    if (appliedIntakeKey.current === intakeKey) return;
    appliedIntakeKey.current = intakeKey;
    const prefill = applyIntakeToProjectInfo(projectInfo, intake.result);
    setProjectInfo(prefill.projectInfo);
    setFieldSources(prefill.fieldSources);
  }, [intake, projectInfo, setProjectInfo]);
  return {
    intake,
    activity,
    fieldSources,
    retryIntake: () => retryMutation.mutate(),
    isRetryingIntake: retryMutation.isPending,
  };
}
