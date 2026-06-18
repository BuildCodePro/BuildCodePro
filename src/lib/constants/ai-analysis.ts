import type { AnalysisTask } from "@/types/new-design";

export const ANALYSIS_TASKS: AnalysisTask[] = [
  { id: "upload-validated", label: "Upload validated" },
  { id: "reading-files", label: "Reading drawing files" },
  { id: "detecting-structure", label: "Detecting floor plan structure" },
  { id: "nfpa-logic", label: "Applying NFPA 72 logic" },
  { id: "device-placement", label: "Generating device placement" },
  { id: "bill-of-materials", label: "Creating Bill of Materials" },
  { id: "compliance-report", label: "Preparing compliance report" },
];

/** Target progress (%) while each task is active — matches design mock at ~67% on step 4 */
export const ANALYSIS_PROGRESS_MILESTONES = [14, 29, 43, 67, 82, 95, 100] as const;

export const ANALYSIS_TASK_DURATION_MS = 2500;
