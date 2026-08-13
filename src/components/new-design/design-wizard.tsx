"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCreateProjectMutation, useGetProjectQuery } from "@/services/projectService";
import { useBulkPresignUploadMutation, useBulkCompleteMutation } from "@/services/drawingService";
import {
  DESIGN_WIZARD_STEPS,
  INITIAL_CHECKLIST_ITEMS,
} from "@/lib/constants/new-design";
import { OCCUPANCY_TYPES } from "@/lib/constants/project-info";
import {
  getProjectInfoChecklistState,
} from "@/lib/validations/project-info";
import {
  DEFAULT_PROJECT_INFO,
  type DesignChecklistItem,
  type DesignWizardStep,
  type ProjectInfoFormData,
  type UploadedFile,
} from "@/types/new-design";
import { getAnalysisJobsApi } from "@/services/analysisService";
import { getDynamicErrorMessage } from "@/lib/utils/error-handler";

import { AnalysisChecklist } from "./analysis-checklist";
import { AiAnalysisStep } from "./ai-analysis-step";
import { DesignStepper } from "./design-stepper";
import { FileDropzone } from "./file-dropzone";
import { ProjectInfoStep } from "./project-info-step";
import { ResultsStep } from "./results-step";
import { WizardBackButton } from "./wizard-navigation";
import { WizardFooter } from "./wizard-footer";
import { Button, Card, CardContent } from "../ui";

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
  "project-info": "Continue",
  upload: "Continue to AI Analysis",
  "ai-analysis": "Continue",
  results: "Finish",
};

const REQUIRED_PROJECT_INFO_FIELDS: {
  key: keyof ProjectInfoFormData;
  message: string;
}[] = [
    { key: "projectName", message: "Project name is required" },
    { key: "address", message: "Address is required" },
    { key: "jurisdiction", message: "Jurisdiction is required" },
    { key: "squareFootage", message: "Square footage is required" },
    { key: "numberOfFloors", message: "Number of floors is required" },
    { key: "occupancyType", message: "Occupancy type is required" },
  ];

// Shape of a structured API error payload, e.g.:
// { error_code: "DESIGN_QUOTA_EXCEEDED", message: "...", used: 14, limit: 5 }
interface ApiErrorPayload {
  error_code?: string;
  message?: string;
  used?: number;
  limit?: number;
  timestamp?: string;
}

// Errors can arrive in different shapes depending on the client/fetch
// wrapper (error.data, error.response.data, or the error itself already
// being the parsed payload). This normalizes all of them.
function extractApiErrorPayload(error: any): ApiErrorPayload | null {
  if (!error) return null;

  const candidate =
    error?.data ??
    error?.response?.data ??
    (typeof error === "object" ? error : null);

  if (candidate && typeof candidate === "object" && "error_code" in candidate) {
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

function validateProjectInfo(
  info: ProjectInfoFormData,
): Partial<Record<keyof ProjectInfoFormData, string>> {
  const errors: Partial<Record<keyof ProjectInfoFormData, string>> = {};

  REQUIRED_PROJECT_INFO_FIELDS.forEach(({ key, message }) => {
    const value = info[key];
    if (typeof value === "string" && !value.trim()) {
      errors[key] = message;
    }
  });

  return errors;
}

// Matches the API's occupancy_type (e.g. "mercantile") to the exact label
// used in OCCUPANCY_TYPES (e.g. "Mercantile"), case-insensitively.
function mapOccupancyType(value?: string | null): string {
  if (!value) return "";
  const match = OCCUPANCY_TYPES.find(
    (type) => type.toLowerCase() === value.toLowerCase(),
  );
  return match ?? value;
}

// Maps a single-project API response into the wizard's form shape.
function mapProjectResponseToFormData(project: any): ProjectInfoFormData {
  return {
    projectName: project?.name ?? "",
    address: project?.address ?? "",
    jurisdiction: project?.jurisdiction ?? "",
    squareFootage:
      project?.square_footage != null ? String(project.square_footage) : "",
    numberOfFloors:
      project?.number_of_floors != null
        ? String(project.number_of_floors)
        : "",
    occupancyType: mapOccupancyType(project?.occupancy_type),
    optionalSystems: {
      sprinkler: Boolean(project?.sprinkler_system),
      elevator: Boolean(project?.elevator),
      ductDetectors: Boolean(project?.duct_detectors),
      voiceEvacuation: Boolean(project?.voice_evacuation),
    },
    specialNotes: project?.special_notes ?? "",
  };
}

export function DesignWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as DesignWizardStep | null;

  const resumeProjectIdParam = searchParams.get("projectId");

  const initialStep = stepParam && DESIGN_WIZARD_STEPS.some((s) => s.id === stepParam)
    ? stepParam
    : "project-info";

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
      try { return JSON.parse(saved); } catch { /* ignore corrupt */ }
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
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isProjectInfoHydrated, setIsProjectInfoHydrated] = useState(false);

  // Quota / plan-limit style blocking errors (e.g. DESIGN_QUOTA_EXCEEDED)
  // render a full-page fallback instead of the wizard form.
  const [quotaError, setQuotaError] = useState<ApiErrorPayload | null>(null);

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
        await createProjectMutation.mutateAsync({
          name: projectInfo.projectName,
          address: projectInfo.address,
          jurisdiction: projectInfo.jurisdiction,
          square_footage: parseInt(projectInfo.squareFootage) || 0,
          number_of_floors: parseInt(projectInfo.numberOfFloors) || 1,
          occupancy_type: projectInfo.occupancyType.toLowerCase(),
          sprinkler_system: projectInfo.optionalSystems.sprinkler,
          elevator: projectInfo.optionalSystems.elevator,
          duct_detectors: projectInfo.optionalSystems.ductDetectors,
          voice_evacuation: projectInfo.optionalSystems.voiceEvacuation,
          special_notes: projectInfo.specialNotes,
        });
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

  const projectChecklist = useMemo(
    () => getProjectInfoChecklistState(projectInfo),
    [projectInfo],
  );

  const checklistItems = useMemo<DesignChecklistItem[]>(() => {
    return INITIAL_CHECKLIST_ITEMS.map((item) => {
      if (item.id === "floor-plans") {
        return { ...item, completed: files.length > 0 };
      }

      return {
        ...item,
        completed: Boolean(
          projectChecklist[item.id as keyof typeof projectChecklist],
        ),
      };
    });
  }, [currentStep, files.length, projectChecklist]);

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

      const updated = { ...prev };
      (Object.keys(updated) as (keyof ProjectInfoFormData)[]).forEach(
        (key) => {
          const value = newData[key];
          if (typeof value === "string" && value.trim()) {
            delete updated[key];
          }
        },
      );
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
    updateStepInUrl("results");
  };

  const handleAnalysisCancel = () => {
    updateStepInUrl("upload");
  };

  const createProjectMutation = useCreateProjectMutation();
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
        const response = await createProjectMutation.mutateAsync({
          name: projectInfo.projectName,
          address: projectInfo.address,
          jurisdiction: projectInfo.jurisdiction,
          square_footage: parseInt(projectInfo.squareFootage) || 0,
          number_of_floors: parseInt(projectInfo.numberOfFloors) || 1,
          occupancy_type: projectInfo.occupancyType.toLowerCase(),
          sprinkler_system: projectInfo.optionalSystems.sprinkler,
          elevator: projectInfo.optionalSystems.elevator,
          duct_detectors: projectInfo.optionalSystems.ductDetectors,
          voice_evacuation: projectInfo.optionalSystems.voiceEvacuation,
          special_notes: projectInfo.specialNotes,
        });

        const newProjectId = response?.id ?? response?.data?.id ?? null;
        setProjectId(newProjectId);
        setJobId(null); // new project → no prior job
        toast.success("Project created successfully!");
      } catch (error) {
        console.error("Failed to create project:", error);
        handleQuotaAwareError(error, "Failed to create project. Please try again.");
        return;
      }
    }

    if (currentStep === "upload") {
      if (!projectId) {
        toast.error("Project must be created before uploading drawings.");
        return;
      }

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

        try {
          // ── Phase 1: get presigned URLs ──────────────────────────────────
          console.log(
            "[Design Wizard] Requesting presigned URLs for",
            filesToUpload.length,
            "drawing(s), project:",
            projectId
          );
          const presignItems = await bulkPresignMutation.mutateAsync({
            projectId,
            payload: {
              files: filesToUpload.map((f) => ({
                file_name: f.file!.name,
                content_type: f.file!.type || "application/octet-stream",
                file_size: f.file!.size,
              })),
            },
          });

          // ── Phase 2: PUT each file directly to S3 ───────────────────────
          // Match by INDEX — presignItems[i] always corresponds to filesToUpload[i]
          // (the backend may normalise file_name, so string matching is unreliable)
          const putResults = await Promise.allSettled(
            presignItems.map(async (item, idx) => {
              const localFile = filesToUpload[idx]?.file;
              if (!localFile) {
                throw new Error(`No local file at index ${idx} for drawing ${item.drawing_id}`);
              }
              const res = await fetch(item.upload_url, {
                method: "PUT",
                body: localFile,
                headers: {
                  "Content-Type": localFile.type || "application/octet-stream",
                },
              });
              if (!res.ok) {
                throw new Error(`S3 upload failed for drawing ${item.drawing_id}: HTTP ${res.status}`);
              }
              return item.drawing_id;
            })
          );

          const successfulDrawingIds: string[] = [];
          putResults.forEach((result, idx) => {
            if (result.status === "fulfilled") {
              successfulDrawingIds.push(result.value);
            } else {
              console.error(
                `[Design Wizard] S3 PUT failed for drawing ${presignItems[idx]?.drawing_id}:`,
                result.reason
              );
            }
          });

          if (successfulDrawingIds.length === 0) {
            throw new Error("All S3 uploads failed. Please try again.");
          }

          // ── Phase 3: confirm uploads via complete-batch ──────────────────
          console.log(
            "[Design Wizard] Confirming",
            successfulDrawingIds.length,
            "upload(s) via complete-batch, drawing_ids:",
            successfulDrawingIds
          );
          const completeResult = await bulkCompleteMutation.mutateAsync({
            projectId,
            payload: { drawing_ids: successfulDrawingIds },
          });

          // Reflect per-file results back on the UI (index-based)
          setFiles((prev) =>
            prev.map((f) => {
              const uploadIdx = filesToUpload.findIndex((fu) => fu.id === f.id);
              if (uploadIdx === -1) return f; // file not in this batch

              const presignItem = presignItems[uploadIdx];

              // S3 PUT failure for this index
              if (!successfulDrawingIds.includes(presignItem.drawing_id)) {
                return { ...f, status: "error", errorMessage: "S3 upload failed" };
              }

              // complete-batch per-item result (matched by drawing_id)
              const batchItem = completeResult.items.find(
                (r) => r.drawing_id === presignItem.drawing_id
              );
              if (batchItem?.success) {
                return { ...f, status: "uploaded" };
              }
              return {
                ...f,
                status: "error",
                errorMessage: batchItem?.error_message ?? "Confirmation failed",
              };
            })
          );


          const { completed_count, failed_count } = completeResult;
          if (failed_count > 0) {
            toast.warning(
              `${completed_count} file(s) uploaded. ${failed_count} file(s) could not be confirmed — check the list for details.`
            );
          } else {
            toast.success(`Uploaded ${completed_count} file(s) successfully!`);
          }
        } catch (error: any) {
          console.error("[Design Wizard] Bulk presign/upload failed:", error);
          const message = getDynamicErrorMessage(error, "Upload failed");
          setFiles((prev) =>
            prev.map((f) =>
              filesToUpload.some((fu) => fu.id === f.id)
                ? { ...f, status: "error", errorMessage: message }
                : f
            )
          );
          toast.error(`Failed to upload drawings: ${message}`);
          setIsUploading(false);
          return;
        }

        setIsUploading(false);
      }

      // Fetch jobs ONCE after upload so AiAnalysisStep gets jobId immediately
      // and the WebSocket connects without delay. No polling needed.
      if (projectId) {
        try {
          const data = await getAnalysisJobsApi(projectId);
          const latestJob = data?.items?.[0];
          if (latestJob?.id) {
            setJobId(latestJob.id);
            console.log("[DesignWizard] Job resolved after upload:", latestJob.id, "status:", latestJob.status);
          } else {
            console.warn("[DesignWizard] No job found after upload — WebSocket will connect once jobId arrives");
          }
        } catch (err) {
          console.warn("[DesignWizard] Job fetch after upload failed:", err);
        }
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
    (currentStep === "project-info" && createProjectMutation.isPending) ||
    (Boolean(resumeProjectIdParam) && isResumeProjectLoading);

  const showBackButton = currentStep !== "project-info";

  let continueLabel = CONTINUE_LABELS[currentStep];
  if (createProjectMutation.isPending && currentStep === "project-info") {
    continueLabel = "Creating...";
  } else if ((isUploading || bulkPresignMutation.isPending || bulkCompleteMutation.isPending) && currentStep === "upload") {
    continueLabel = "Uploading...";
  }

  // --- Blocking fallback: monthly design/quota limit reached ---
  if (quotaError) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="size-6 text-red-600"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="font-body text-base font-semibold text-foreground">
                Monthly design limit reached
              </h3>
              <p className="mx-auto max-w-md font-body text-sm text-stat-label">
                {quotaError.message ??
                  "You've reached your monthly design limit."}
              </p>
              {quotaError.used != null && quotaError.limit != null ? (
                <p className="font-body text-xs text-stat-label">
                  {quotaError.used} of {quotaError.limit} designs used this
                  month
                </p>
              ) : null}
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 max-w-none px-6"
                onClick={() => router.push("/company/projects")}
              >
                Back to Projects
              </Button>
              <Button
                type="button"
                className="h-11 max-w-none px-6"
                onClick={() => router.push("/company/billing")}
              >
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {showBackButton ? <WizardBackButton onClick={handleBack} /> : null}

      <DesignStepper steps={DESIGN_WIZARD_STEPS} currentStep={currentStep} />

      {currentStep === "upload" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <FileDropzone
            projectId={projectId}
            files={files}
            onFilesAdded={handleFilesAdded}
            onFileUpdate={handleFileUpdate}
            onFileRemove={handleFileRemove}
          />
          <AnalysisChecklist items={checklistItems} />
        </div>
      ) : null}

      {currentStep === "project-info" ? (
        <ProjectInfoStep
          data={projectInfo}
          errors={projectInfoErrors}
          onChange={handleProjectInfoChange}
        />
      ) : null}

      {currentStep === "ai-analysis" ? (
        <AiAnalysisStep
          files={files}
          projectInfo={projectInfo}
          projectId={projectId}
          jobId={jobId}
          // onJobIdResolved={setJobId}
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