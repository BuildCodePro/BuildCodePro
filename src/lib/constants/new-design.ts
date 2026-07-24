import type { DesignChecklistItem, DesignStep } from "@/types/new-design";

export const DESIGN_WIZARD_STEPS: DesignStep[] = [
  { id: "project-info", number: 1, label: "Project Info" },
  { id: "upload", number: 2, label: "Upload Drawing" },
  { id: "ai-analysis", number: 3, label: "AI Analysis" },
  { id: "results", number: 4, label: "Results" },
];

export const ACCEPTED_DRAWING_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export const ACCEPTED_DRAWING_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
] as const;

export const MAX_DRAWING_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export const INITIAL_CHECKLIST_ITEMS: DesignChecklistItem[] = [
  { id: "floor-plans", label: "Floor plans uploaded", completed: false },
  { id: "address", label: "Project address required", completed: false },
  { id: "jurisdiction", label: "Jurisdiction required", completed: false },
  { id: "occupancy", label: "Occupancy type required", completed: false },
  { id: "square-footage", label: "Square footage required", completed: false },
  { id: "floors", label: "Number of floors required", completed: false },
];

export const SAMPLE_UPLOADED_FILE = {
  id: "sample-1",
  name: "Floor_Plan_Building_A.pdf",
  size: 12.4 * 1024 * 1024,
  type: "application/pdf",
  status: "ready" as const,
};
