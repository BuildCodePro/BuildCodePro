import type {
  DesignResults,
  ProjectInfoFormData,
} from "@/types/new-design";

import { BOM_TOTAL_ITEMS } from "./bom";
import { MOCK_COMPLIANCE_RESULTS } from "./compliance";

export const RESULTS_TABS = [
  { id: "design-recommendations", label: "Design Recommendations" },
  { id: "bom", label: "BOM / Material Takeoff" },
  { id: "compliance", label: "Compliance Checklist" },
  { id: "narrative", label: "Design Narrative" },
  { id: "exports", label: "Exports" },
] as const;

export const MOCK_DESIGN_RESULTS: DesignResults = {
  generatedAt: "2025-06-09",
  bomTotalItems: BOM_TOTAL_ITEMS,
  compliance: MOCK_COMPLIANCE_RESULTS,
  metrics: [
    {
      id: "devices",
      label: "Suggested Devices",
      value: "84",
      description: "Smoke, Pull, Horn/Strobe",
    },
    {
      id: "wiring",
      label: "Estimated Wiring",
      value: "4,200 ft",
      description: "2-Wire circuit runs",
    },
    {
      id: "compliance",
      label: "Compliance Status",
      value: "91%",
      description: "NFPA 72 Pass Rate",
    },
    {
      id: "review-flags",
      label: "Review Flags",
      value: "3",
      description: "Engineer review needed",
    },
  ],
  recommendations: [
    {
      id: "initiating",
      title: "Initiating Devices",
      count: "42 devices",
      description: "Smoke detectors, Manual pull stations",
      accent: "red",
      badge: "94%",
      badgeVariant: "success",
    },
    {
      id: "notification",
      title: "Notification Appliances",
      count: "28 devices",
      description: "Horns, strobes, horn/strobe combos",
      accent: "yellow",
      badge: "91%",
      badgeVariant: "success",
    },
    {
      id: "control",
      title: "Control Equipment",
      count: "6 panels",
      description: "FACP, NAC power supplies, annunciators",
      accent: "green",
      badge: "88%",
      badgeVariant: "success",
    },
    {
      id: "review",
      title: "Review Required",
      count: "3 flags",
      description: "Spacing exceptions, egress paths, ceiling height",
      accent: "orange",
      badge: "—",
      badgeVariant: "warning",
    },
  ],
};

export function getProjectDisplayName(projectInfo: ProjectInfoFormData): string {
  return projectInfo.projectName.trim() || "Riverside Mall — Building A";
}
