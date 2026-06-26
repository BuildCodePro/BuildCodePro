"use client";

import { useMemo, useState } from "react";

import {
  DESIGN_WIZARD_STEPS,
  INITIAL_CHECKLIST_ITEMS,
  SAMPLE_UPLOADED_FILE,
} from "@/lib/constants/new-design";
import {
  getProjectInfoChecklistState,
  validateProjectInfoForm,
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
  upload: "Continue",
  "project-info": "Continue to AI Analysis",
  "ai-analysis": "Continue",
  results: "Finish",
};

export function DesignWizard() {
  const [currentStep, setCurrentStep] =
    useState<DesignWizardStep>("upload");
  const [files, setFiles] = useState<UploadedFile[]>([SAMPLE_UPLOADED_FILE]);
  const [projectInfo, setProjectInfo] =
    useState<ProjectInfoFormData>(DEFAULT_PROJECT_INFO);
  const [projectInfoErrors, setProjectInfoErrors] = useState<
    Partial<Record<keyof ProjectInfoFormData, string>>
  >({});

  const projectChecklist = useMemo(
    () => getProjectInfoChecklistState(projectInfo),
    [projectInfo],
  );

  const checklistItems = useMemo<DesignChecklistItem[]>(() => {
    if (currentStep === "upload") {
      return INITIAL_CHECKLIST_ITEMS.map((item) =>
        item.id === "floor-plans"
          ? { ...item, completed: files.length > 0 }
          : item,
      );
    }

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

  const handleFileRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleBack = () => {
    const currentIndex = DESIGN_WIZARD_STEPS.findIndex(
      (step) => step.id === currentStep,
    );
    const previousStep = DESIGN_WIZARD_STEPS[currentIndex - 1];

    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  };

  const handleAnalysisComplete = () => {
    setCurrentStep("results");
  };

  const handleAnalysisCancel = () => {
    setCurrentStep("project-info");
  };

  const handleContinue = () => {
    if (currentStep === "project-info") {
      const validation = validateProjectInfoForm(projectInfo);
      setProjectInfoErrors(validation.errors);

      if (!validation.success) {
        return;
      }
    }

    const currentIndex = DESIGN_WIZARD_STEPS.findIndex(
      (step) => step.id === currentStep,
    );
    const nextStep = DESIGN_WIZARD_STEPS[currentIndex + 1];

    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  };

  const showBackButton = currentStep !== "upload";

  return (
    <div className="flex w-full flex-col gap-6">
      {showBackButton ? <WizardBackButton onClick={handleBack} /> : null}

      <DesignStepper steps={DESIGN_WIZARD_STEPS} currentStep={currentStep} />

      {currentStep === "upload" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <FileDropzone
            files={files}
            onFilesAdded={handleFilesAdded}
            onFileRemove={handleFileRemove}
          />
          <AnalysisChecklist items={checklistItems} />
        </div>
      ) : null}

      {currentStep === "project-info" ? (
        <ProjectInfoStep
          data={projectInfo}
          errors={projectInfoErrors}
          onChange={setProjectInfo}
        />
      ) : null}

      {currentStep === "ai-analysis" ? (
        <AiAnalysisStep
          files={files}
          projectInfo={projectInfo}
          onComplete={handleAnalysisComplete}
          onCancel={handleAnalysisCancel}
        />
      ) : null}

      {currentStep === "results" ? (
        <ResultsStep projectInfo={projectInfo} />
      ) : null}

      {currentStep !== "ai-analysis" && currentStep !== "results" ? (
        <WizardFooter
          onSaveDraft={() => undefined}
          onContinue={handleContinue}
          continueLabel={CONTINUE_LABELS[currentStep]}
          isContinueDisabled={currentStep === "upload" && files.length === 0}
        />
      ) : null}
    </div>
  );
}
