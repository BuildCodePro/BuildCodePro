"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCreateProjectMutation } from "@/services/projectService";
import { useUploadDrawingMutation } from "@/services/drawingService";
import { useStartAnalysisMutation } from "@/services/analysisService";

import {
  DESIGN_WIZARD_STEPS,
  INITIAL_CHECKLIST_ITEMS,
} from "@/lib/constants/new-design";
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

export function DesignWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as DesignWizardStep | null;
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
  const [projectInfo, setProjectInfo] = useState<ProjectInfoFormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("buildcodepro_wizard_projectInfo");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved projectInfo", e);
        }
      }
    }
    return DEFAULT_PROJECT_INFO;
  });
  const [projectInfoErrors, setProjectInfoErrors] = useState<
    Partial<Record<keyof ProjectInfoFormData, string>>
  >({});
  const [projectId, setProjectId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("buildcodepro_wizard_projectId");
    }
    return null;
  });
  const [jobId, setJobId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("buildcodepro_wizard_projectInfo", JSON.stringify(projectInfo));
    }
  }, [projectInfo]);

  useEffect(() => {
    if (typeof window !== "undefined" && projectId) {
      localStorage.setItem("buildcodepro_wizard_projectId", projectId);
    }
  }, [projectId]);

  console.log(" desiegn projectId", projectId);

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
    setProjectInfoErrors((prev) => {
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

        setProjectId(response?.id ?? response?.data?.id ?? null);
        toast.success("Project created successfully!");
      } catch (error) {
        console.error("Failed to create project:", error);
        toast.error("Failed to create project. Please try again.");
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

        setFiles((prev) =>
          prev.map((f) =>
            filesToUpload.some((fu) => fu.id === f.id)
              ? { ...f, status: "uploading", errorMessage: undefined }
              : f
          )
        );

        for (const fileObj of filesToUpload) {
          try {
            console.log(
              "Uploading drawing:",
              fileObj.name,
              "for project:",
              projectId
            );
            const response = await uploadDrawingMutation.mutateAsync({
              projectId,
              file: fileObj.file!,
            });
            console.log("Upload success:", response);
            toast.success(`Uploaded ${fileObj.name} successfully!`);
            handleFileUpdate(fileObj.id, {
              status: "uploaded",
              drawingId: response?.data?.id,
            });
          } catch (error : any) {
            console.error("Upload failed:", error);
            const message =
              error instanceof Error
                ? error.message
                : error.data.message;
            handleFileUpdate(fileObj.id, {
              status: "error",
              errorMessage: message,
            });
            toast.error(`Failed to upload ${fileObj.name}: ${message}`);
            hasError = true;
          }
        }

        setIsUploading(false);
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
        console.log("[Design Wizard] Starting analysis for project:", projectId);
        const analysisResponse = await startAnalysisMutation.mutateAsync(projectId);
        console.log("[Design Wizard] Analysis started:", analysisResponse);
        setJobId(analysisResponse.job_id);
      } catch (error) {
        console.error("[Design Wizard] Failed to start analysis:", error);
        toast.error("Failed to start AI analysis. Please try again.");
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
    (currentStep === "project-info" && createProjectMutation.isPending);

  const showBackButton = currentStep !== "project-info";

  let continueLabel = CONTINUE_LABELS[currentStep];
  if (createProjectMutation.isPending && currentStep === "project-info") {
    continueLabel = "Creating...";
  } else if (isUploading && currentStep === "upload") {
    continueLabel = "Uploading...";
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
          onSaveDraft={() => undefined}
          onContinue={handleContinue}
          continueLabel={continueLabel}
          isContinueDisabled={isContinueDisabled}
        />
      ) : null}
    </div>
  );
}