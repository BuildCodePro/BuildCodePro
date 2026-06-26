import type { ProjectDetailTabId } from "@/types/project-details";

export const PROJECT_DETAIL_TABS: { id: ProjectDetailTabId; label: string }[] =
  [
    { id: "results", label: "Results" },
    { id: "history", label: "Version History" },
    { id: "activity", label: "Activity Log" },
  ];
