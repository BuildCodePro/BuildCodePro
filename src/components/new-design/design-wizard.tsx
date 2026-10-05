"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCreateProjectMutation, useGetProjectQuery } from "@/services/projectService";
import { useConfirmProjectInfoMutation, useCreateDraftProjectMutation } from "@/services/projectIntakeService";
import { useBulkPresignUploadMutation, useBulkCompleteMutation } from "@/services/drawingService";
import {
  DESIGN_WIZARD_STEPS,
} from "@/lib/constants/new-design";
import {
  DEFAULT_PROJECT_INFO,
  type DesignWizardStep,
  type ProjectInfoFormData,
  type UploadedFile,
} from "@/types/new-design";
import { getAnalysisJobsApi, useAnalysisJobsQuery } from "@/services/analysisService";

import { AiAnalysisStep } from "./ai-analysis-step";
import { ConstructionContextPanel } from "./construction-context-panel";
import { DesignStepper } from "./design-stepper";
import { FileDropzone } from "./file-dropzone";
import { IntakeStatusBanner } from "./intake-status-banner";
import { ProjectInfoStep } from "./project-info-step";
import { useProjectIntakePrefill } from "./use-project-intake-prefill";
import { ResultsStep } from "./results-step";
import { uploadWizardDrawings } from "./upload-wizard-drawings";
import { WizardBackButton } from "./wizard-navigation";
import { WizardFooter } from "./wizard-footer";
import { QuotaLimitFallback } from "./quota-limit-fallback";
import {
  type ApiErrorPayload,
  buildProjectPayload,
  extractApiErrorPayload,
  getErrorMessage,
  mapProjectResponseToFormData,
  validateProjectInfo,
} from "./wizard-helpers";
import { validateProjectInfoForm } from "@/lib/validations/project-info";

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------
const LS = {
  PROJECT_ID: "buildcodepro_wizard_projectId",
  JOB_ID: "buildcodepro_wizard_jobId",
  PROJECT_INFO: "buildcodepro_wizard_projectInfo",
} as const;

const lsGet = (key: string) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;
const lsSet = (key: string, val: string) =>
  typeof window !== "undefined" && localStorage.setItem(key, val);
const lsRemove = (key: string) =>
  typeof window !== "undefined" && localStorage.removeItem(key);

const CONTINUE_LABELS: Record<DesignWizardStep, string> = {
  upload: "Upload and Continue",
  "project-info": "Confirm and Calculate",
  "ai-analysis": "Continue",
  results: "Finish",
};


export function DesignWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as DesignWizardStep | null;

  const resumeProjectIdParam = searchParams.get("projectId");

  const initialStep = stepParam && DESIGN_WIZARD_STEPS.some((s) => s.id === stepParam)
    ? stepParam
    : "upload";

  const [currentStep, setCurrentStep] = useState<DesignWizardStep>(initialStep);

  // Sync step state with URL (browser back/forward)
  useEffect(() => {
    if (stepParam && stepParam !== currentStep && DESIGN_WIZARD_STEPS.some((s) => s.id === stepParam)) {
      setCurrentStep(stepParam);
    }
  }, [stepParam, currentStep]);

  const updateStepInUrl = useCallback(
    (newStep: DesignWizardStep) => {
      setCurrentStep(newStep);
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", newStep);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // ── Persisted state ────────────────────────────────────────────────────────

  const [files, setFiles] = useState<UploadedFile[]>([]);

  const [projectInfo, setProjectInfo] = useState<ProjectInfoFormData>(() => {
    const saved = lsGet(LS.PROJECT_INFO);
    if (saved) {
      try {
        const savedInfo = JSON.parse(saved);
        return {
          ...DEFAULT_PROJECT_INFO,
          ...savedInfo,
          optionalSystems: { ...DEFAULT_PROJECT_INFO.optionalSystems, ...(savedInfo?.optionalSystems ?? {}) },
        };
      } catch { /* ignore corrupt */ }
    }
    return DEFAULT_PROJECT_INFO;
  });

  const [projectInfoErrors, setProjectInfoErrors] = useState<
    Partial<Record<keyof ProjectInfoFormData, string>>
  >({});

  // projectId and jobId are persisted so page refresh reconnects the WebSocket
  const [projectId, setProjectId] = useState<string | null>(() => lsGet(LS.PROJECT_ID));
  const [jobId, setJobId] = useState<string | null>(() => lsGet(LS.JOB_ID));
  const [isUploading, setIsUploading] = useState(false);
  const [isStartRequested, setIsStartRequested] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isProjectInfoHydrated, setIsProjectInfoHydrated] = useState(false);

  // Quota / plan-limit style blocking errors (e.g. DESIGN_QUOTA_EXCEEDED)
  // render a full-page fallback instead of the wizard form.
  const [quotaError, setQuotaError] = useState<ApiErrorPayload | null>(null);
  const { data: analysisJobsData } = useAnalysisJobsQuery(projectId);
  const constructionExtract =
    analysisJobsData?.items.find((job) => job.status === "completed")
      ?.construction_extract ??
    analysisJobsData?.items[0]?.construction_extract ??
    null;

  const handleQuotaAwareError = (error: any, fallback: string) => {
    const payload = extractApiErrorPayload(error);
    if (payload?.error_code === "DESIGN_QUOTA_EXCEEDED") {
      setQuotaError(payload);
    } else {
      toast.error(getErrorMessage(error, fallback));
    }
  };

  const handleSaveDraft = async () => {
    if (currentStep === "project-info" && !projectId) {
      const validationErrors = validateProjectInfo(projectInfo);
      if (Object.keys(validationErrors).length > 0) {
        setProjectInfoErrors(validationErrors);
        toast.error("Please fill in all required fields to save draft.");
        return;
      }

      setIsSavingDraft(true);
      try {
        await createProjectMutation.mutateAsync(buildProjectPayload(projectInfo));
        toast.success("Draft saved successfully.");
      } catch (error) {
        console.error("Failed to save draft:", error);
        handleQuotaAwareError(error, "Failed to save draft. Please try again.");
        setIsSavingDraft(false);
        return;
      }
      setIsSavingDraft(false);
    } else {
      toast.success("Draft saved successfully.");
    }

    const basePath = pathname.startsWith("/estimator") ? "/estimator" : "/company";
    router.push(`${basePath}/projects`);
  };

  const {
    data: resumeProjectData,
    isLoading: isResumeProjectLoading,
    isError: isResumeProjectError,
  } = useGetProjectQuery(resumeProjectIdParam ?? "");

  useEffect(() => {
    if (!resumeProjectIdParam) return;

    if (isResumeProjectError) {
      toast.error("Couldn't load that project. Please try again.");
      return;
    }

    const project = (resumeProjectData as any)?.data ?? resumeProjectData;
    if (!project) return;

    setProjectInfo(mapProjectResponseToFormData(project));
    setProjectId(project.id ?? resumeProjectIdParam);
    setProjectInfoErrors({});
    setIsProjectInfoHydrated(true);
  }, [resumeProjectIdParam, resumeProjectData, isResumeProjectError]);

  // Hydrate projectInfo + projectId from localStorage once, on mount —
  // but only when we're NOT resuming a specific project via ?projectId=,
  // since the API data above should win in that case.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (resumeProjectIdParam) return; // resume flow handles hydration itself

    try {
      const savedInfo = localStorage.getItem("buildcodepro_wizard_projectInfo");
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        setProjectInfo((prev) => ({
          ...DEFAULT_PROJECT_INFO,
          ...prev,
          ...parsed,
          optionalSystems: {
            ...DEFAULT_PROJECT_INFO.optionalSystems,
            ...(parsed?.optionalSystems ?? {}),
          },
        }));
      }
    } catch (e) {
      console.error("Failed to parse saved projectInfo", e);
    }

    const savedProjectId = localStorage.getItem("buildcodepro_wizard_projectId");
    if (savedProjectId) {
      setProjectId(savedProjectId);
    }

    setIsProjectInfoHydrated(true);
  }, [resumeProjectIdParam]);

  useEffect(() => { if (projectId) lsSet(LS.PROJECT_ID, projectId); }, [projectId]);
  useEffect(() => { if (jobId) lsSet(LS.JOB_ID, jobId); else lsRemove(LS.JOB_ID); }, [jobId]);
  useEffect(() => { lsSet(LS.PROJECT_INFO, JSON.stringify(projectInfo)); }, [projectInfo]);

  // ── On-mount job check ─────────────────────────────────────────────────────
  // When the page loads with an existing projectId (e.g. after refresh), fetch
  // the latest job ONCE and route the user to the correct wizard step.
  // No polling — the WebSocket is the live data source.
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const routeByJobStatus = useCallback(
    (status: string) => {
      if (status === "completed") {
        updateStepInUrl("results");
      } else if (status === "running" || status === "pending" || status === "failed" || status === "cancelled") {
        updateStepInUrl("ai-analysis");
      }
    },
    [updateStepInUrl],
  );

  useEffect(() => {
    // Only auto-route if we're on a step that could be stale after a refresh
    if (!projectId || initialCheckDone) return;
    if (currentStep !== "ai-analysis" && currentStep !== "results") {
      setInitialCheckDone(true);
      return;
    }
    (async () => {
      try {
        const data = await getAnalysisJobsApi(projectId);
        const latestJob = data?.items?.[0];
        if (latestJob) {
          if (latestJob.id !== jobId) setJobId(latestJob.id);
          routeByJobStatus(latestJob.status as string);
        }
      } catch (err) {
        console.warn("[DesignWizard] Initial job check failed:", err);
      } finally {
        setInitialCheckDone(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileUpdate = (id: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...updates } : file)),
    );
  };

  const handleFileRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleProjectInfoChange = (newData: ProjectInfoFormData) => {
    setProjectInfo(newData);
    setProjectInfoErrors((prev: any) => {
      if (Object.keys(prev).length === 0) return prev;
      const freshErrors = validateProjectInfoForm(newData).errors;
      const updated: Partial<Record<keyof ProjectInfoFormData, string>> = {};
      (Object.keys(prev) as (keyof ProjectInfoFormData)[]).forEach((key) => {
        if (freshErrors[key]) updated[key] = freshErrors[key];
      });
      return updated;
    });
  };

  const handleBack = () => {
    const currentIndex = DESIGN_WIZARD_STEPS.findIndex(
      (step) => step.id === currentStep,
    );
    const previousStep = DESIGN_WIZARD_STEPS[currentIndex - 1];

    if (previousStep) {
      updateStepInUrl(previousStep.id);
    }
  };

  const handleAnalysisComplete = () => {
    setIsStartRequested(false);
    updateStepInUrl("results");
  };

  const handleAnalysisCancel = () => {
    setIsStartRequested(false);
    updateStepInUrl("upload");
  };

  const createProjectMutation = useCreateProjectMutation();
  const createDraftProjectMutation = useCreateDraftProjectMutation();
  const confirmProjectInfoMutation = useConfirmProjectInfoMutation();
  const intakePrefill = useProjectIntakePrefill(projectId, projectInfo, setProjectInfo);
  const bulkPresignMutation = useBulkPresignUploadMutation();
  const bulkCompleteMutation = useBulkCompleteMutation();

  const handleContinue = async () => {
    if (currentStep === "project-info") {
      const validationErrors = validateProjectInfo(projectInfo);

      if (Object.keys(validationErrors).length > 0) {
        setProjectInfoErrors(validationErrors);
        toast.error("Please fill in all required fields.");
        return;
      }

      setProjectInfoErrors({});

      try {
        if (projectId) {
          await confirmProjectInfoMutation.mutateAsync({ projectId, payload: buildProjectPayload(projectInfo) });
          toast.success("Project details confirmed.");
          setIsStartRequested(true);
        } else {
          const response = await createProjectMutation.mutateAsync(buildProjectPayload(projectInfo));
          setProjectId(response?.id ?? response?.data?.id ?? null);
          setJobId(null);
          toast.success("Project created successfully!");
          setIsStartRequested(true);
        }
      } catch (error) {
        console.error("Failed to save project info:", error);
        handleQuotaAwareError(error, "Failed to save project details. Please try again.");
        return;
      }
    }

    if (currentStep === "upload") {
      let uploadProjectId = projectId;
      if (!uploadProjectId) {
        try {
          const draftProject = await createDraftProjectMutation.mutateAsync();
          uploadProjectId = draftProject?.id ?? null;
          setProjectId(uploadProjectId);
          setJobId(null);
        } catch (error) {
          handleQuotaAwareError(error, "Could not start a new project. Please try again.");
          return;
        }
      }
      if (!uploadProjectId) return;

      const filesToUpload = files.filter(
        (f) => (f.status === "ready" || f.status === "error") && f.file
      );

      if (filesToUpload.length > 0) {
        setIsUploading(true);

        // Mark all queued files as uploading
        setFiles((prev) =>
          prev.map((f) =>
            filesToUpload.some((fu) => fu.id === f.id)
              ? { ...f, status: "uploading", errorMessage: undefined }
              : f
          )
        );

        const isUploadSuccessful = await uploadWizardDrawings({
          uploadProjectId,
          filesToUpload,
          presign: bulkPresignMutation.mutateAsync,
          complete: bulkCompleteMutation.mutateAsync,
          setFiles,
        });
        if (!isUploadSuccessful) {
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }
    }

    const currentIndex = DESIGN_WIZARD_STEPS.findIndex(
      (step) => step.id === currentStep,
    );
    const nextStep = DESIGN_WIZARD_STEPS[currentIndex + 1];

    if (nextStep) {
      updateStepInUrl(nextStep.id);
    }
  };

  const isContinueDisabled =
    (currentStep === "upload" &&
      (files.length === 0 ||
        files.some((f) => f.status === "uploading") ||
        isUploading)) ||
    (currentStep === "project-info" && (createProjectMutation.isPending || confirmProjectInfoMutation.isPending)) ||
    (Boolean(resumeProjectIdParam) && isResumeProjectLoading);

  const showBackButton = currentStep !== "upload";

  let continueLabel = CONTINUE_LABELS[currentStep];
  if ((createProjectMutation.isPending || confirmProjectInfoMutation.isPending) && currentStep === "project-info") {
    continueLabel = "Saving...";
  } else if ((isUploading || bulkPresignMutation.isPending || bulkCompleteMutation.isPending) && currentStep === "upload") {
    continueLabel = "Uploading...";
  }

  if (quotaError) {
    return <QuotaLimitFallback quotaError={quotaError} onBackToProjects={() => router.push("/company/projects")} onUpgrade={() => router.push("/company/billing")} />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {showBackButton ? <WizardBackButton onClick={handleBack} /> : null}

      <DesignStepper steps={DESIGN_WIZARD_STEPS} currentStep={currentStep} />

      {currentStep === "upload" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <FileDropzone
            projectId={projectId}
            files={files}
            onFilesAdded={handleFilesAdded}
            onFileUpdate={handleFileUpdate}
            onFileRemove={handleFileRemove}
          />
          <ConstructionContextPanel
            projectInfo={projectInfo}
            hasDrawings={files.length > 0}
            constructionExtract={constructionExtract}
          />
        </div>
      ) : null}

      {currentStep === "project-info" ? (
        <ProjectInfoStep
          data={projectInfo}
          errors={projectInfoErrors}
          onChange={handleProjectInfoChange}
          fieldSources={intakePrefill.fieldSources}
          intakeBanner={
            <IntakeStatusBanner
              intake={intakePrefill.intake}
              activity={intakePrefill.activity}
              filledFieldCount={Object.keys(intakePrefill.fieldSources).length}
              onRetry={intakePrefill.retryIntake}
              isRetrying={intakePrefill.isRetryingIntake}
            />
          }
        />
      ) : null}

      {currentStep === "ai-analysis" && (isStartRequested || initialCheckDone) ? (
        <AiAnalysisStep
          files={files}
          projectInfo={projectInfo}
          projectId={projectId}
          jobId={jobId}
          startNewRun={isStartRequested}
          onRunStarted={() => setIsStartRequested(false)}
          onComplete={handleAnalysisComplete}
          onCancel={handleAnalysisCancel}
        />
      ) : null}

      {currentStep === "results" ? (
        <ResultsStep projectInfo={projectInfo} projectId={projectId || ""} />
      ) : null}

      {currentStep !== "ai-analysis" && currentStep !== "results" ? (
        <WizardFooter
          onSaveDraft={handleSaveDraft}
          onContinue={handleContinue}
          continueLabel={continueLabel}
          isContinueDisabled={isContinueDisabled}
          isSavingDraft={isSavingDraft}
          isSaveDraftDisabled={currentStep === "project-info" && Object.keys(validateProjectInfo(projectInfo)).length > 0}
        />
      ) : null}
    </div>
  );
}