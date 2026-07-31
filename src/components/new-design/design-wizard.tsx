"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateProjectMutation,
  useGetProjectQuery,
} from "@/services/projectService";
import { useUploadDrawingMutation } from "@/services/drawingService";
import { useStartAnalysisMutation } from "@/services/analysisService";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

import { AnalysisChecklist } from "./analysis-checklist";
import { AiAnalysisStep } from "./ai-analysis-step";
import { DesignStepper } from "./design-stepper";
import { FileDropzone } from "./file-dropzone";
import { ProjectInfoStep } from "./project-info-step";
import { ResultsStep } from "./results-step";
import { WizardBackButton } from "./wizard-navigation";
import { WizardFooter } from "./wizard-footer";

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

  useEffect(() => {
    if (stepParam && stepParam !== currentStep && DESIGN_WIZARD_STEPS.some((s) => s.id === stepParam)) {
      setCurrentStep(stepParam);
    }
  }, [stepParam, currentStep]);

  const updateStepInUrl = (newStep: DesignWizardStep) => {
    setCurrentStep(newStep);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", newStep);
    router.push(`${pathname}?${params.toString()}`);
  };
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // Always start with defaults on both server & client render (avoids
  // hydration mismatch), then hydrate from localStorage / the resume API
  // explicitly on mount.
  const [projectInfo, setProjectInfo] = useState<ProjectInfoFormData>(
    DEFAULT_PROJECT_INFO,
  );
  const [isProjectInfoHydrated, setIsProjectInfoHydrated] = useState(false);

  const [projectInfoErrors, setProjectInfoErrors] = useState<Partial<Record<keyof ProjectInfoFormData, string>>
  >({});
  const [projectId, setProjectId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Quota / plan-limit style blocking errors (e.g. DESIGN_QUOTA_EXCEEDED)
  // render a full-page fallback instead of the wizard form.
  const [quotaError, setQuotaError] = useState<ApiErrorPayload | null>(null);

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

  useEffect(() => {
    if (typeof window !== "undefined" && isProjectInfoHydrated) {
      localStorage.setItem("buildcodepro_wizard_projectInfo", JSON.stringify(projectInfo));
    }
  }, [projectInfo, isProjectInfoHydrated]);

  useEffect(() => {
    if (typeof window !== "undefined" && projectId) {
      localStorage.setItem("buildcodepro_wizard_projectId", projectId);
    }
  }, [projectId]);

  // Clear the local storage draft when the user navigates away (component unmounts).
  // Note: This does NOT run on browser refresh, so refresh preserves the draft,
  // but navigating to Dashboard and back will start a fresh design.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("buildcodepro_wizard_projectInfo");
        localStorage.removeItem("buildcodepro_wizard_projectId");
      }
    };
  }, []);

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
  const uploadDrawingMutation = useUploadDrawingMutation();
  const startAnalysisMutation = useStartAnalysisMutation();

  // Shared payload builder so Continue and Save Draft always send the same
  // project data — only the `status` field differs.
  const buildProjectPayload = (status: "draft" | "active") => ({
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
    status,
  });

  // Central handler: if this is a DESIGN_QUOTA_EXCEEDED (or similar
  // blocking) error, switch to the fallback screen instead of just
  // toasting. Returns true if it was handled as a quota error.
  const handleQuotaAwareError = (error: any, fallbackMessage: string): boolean => {
    const payload = extractApiErrorPayload(error);

    if (payload?.error_code === "DESIGN_QUOTA_EXCEEDED") {
      setQuotaError(payload);
      toast.error(payload.message ?? fallbackMessage);
      return true;
    }

    toast.error(getErrorMessage(error, fallbackMessage));
    return false;
  };

  // Save Draft: only saves + redirects to the projects list.
  // It intentionally does NOT touch `currentStep` / call updateStepInUrl.
  const handleSaveDraft = async () => {
    if (isSavingDraft) return; // prevent double submits

    setIsSavingDraft(true);
    try {
      const response = await createProjectMutation.mutateAsync(
        buildProjectPayload("draft"),
      );

      setProjectId(response?.id ?? response?.data?.id ?? null);
      toast.success("Draft saved successfully!");

      // Navigate away to the projects list after saving.
      router.push("/company/projects");
    } catch (error) {
      console.error("Failed to save draft:", error);
      handleQuotaAwareError(error, "Failed to save draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
    }
  };

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
        const response = await createProjectMutation.mutateAsync(
          buildProjectPayload("active"),
        );

        setProjectId(response?.id ?? response?.data?.id ?? null);
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
        let hasError = false;
        let hasQuotaError = false;

        setFiles((prev) =>
          prev.map((f) =>
            filesToUpload.some((fu) => fu.id === f.id)
              ? { ...f, status: "uploading", errorMessage: undefined }
              : f
          )
        );

        for (const fileObj of filesToUpload) {
          try {
            const response = await uploadDrawingMutation.mutateAsync({
              projectId,
              file: fileObj.file!,
            });
            toast.success(`Uploaded ${fileObj.name} successfully!`);
            handleFileUpdate(fileObj.id, {
              status: "uploaded",
              drawingId: response?.data?.id,
            });
          } catch (error: any) {
            console.error("Upload failed:", error);
            const message = getErrorMessage(error, "Upload failed.");
            handleFileUpdate(fileObj.id, {
              status: "error",
              errorMessage: message,
            });

            const wasQuota = handleQuotaAwareError(
              error,
              `Failed to upload ${fileObj.name}: ${message}`,
            );

            hasError = true;
            if (wasQuota) {
              hasQuotaError = true;
              break; // stop uploading remaining files, quota is exhausted
            }
          }
        }

        setIsUploading(false);
        if (hasQuotaError) {
          return; // fallback screen will render; don't proceed to next step
        }
        if (hasError) {
          return;
        }
      }

      // Start AI analysis job and get job_id for WebSocket
      if (!projectId) {
        toast.error("Project ID is missing.");
        return;
      }
      try {
        const analysisResponse = await startAnalysisMutation.mutateAsync(projectId);
        setJobId(analysisResponse.job_id);
      } catch (error) {
        console.error("[Design Wizard] Failed to start analysis:", error);
        handleQuotaAwareError(error, "Failed to start AI analysis. Please try again.");
        return;
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
  } else if (isUploading && currentStep === "upload") {
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
        />
      ) : null}
    </div>
  );
}