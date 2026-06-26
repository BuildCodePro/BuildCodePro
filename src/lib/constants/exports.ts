import type {
  DesignResults,
  ExportFormatOption,
  ExportIncludeOption,
  ExportPreviewData,
  ProjectInfoFormData,
} from "@/types/new-design";

import { BOM_TOTAL_ITEMS } from "./bom";
import { MOCK_COMPLIANCE_RESULTS } from "./compliance";
import { getProjectDisplayName } from "./results";
import {
  formatOccupancyType,
} from "@/lib/utils/format-project-metadata";

export const EXPORT_FORMAT_OPTIONS: ExportFormatOption[] = [
  {
    id: "pdf",
    title: "PDF Report",
    description: "Full formatted report with branding",
  },
  {
    id: "csv",
    title: "CSV — BOM",
    description: "Raw materials list for estimating",
  },
  {
    id: "print",
    title: "Print Layout",
    description: "Printer-optimized layout",
  },
  {
    id: "email",
    title: "Email Share",
    description: "Send report link via email",
  },
];

export const EXPORT_INCLUDE_OPTIONS: ExportIncludeOption[] = [
  { id: "design-recommendations", label: "Design Recommendations", defaultChecked: true },
  { id: "bom", label: "Bill of Materials (BOM)", defaultChecked: true },
  { id: "compliance", label: "Compliance Checklist", defaultChecked: true },
  { id: "narrative", label: "Design Narrative", defaultChecked: true },
  { id: "nfpa-disclaimer", label: "NFPA 72 Disclaimer", defaultChecked: false },
  { id: "company-branding", label: "Company Branding", defaultChecked: false },
];

export const EXPORT_DISCLAIMER_TEXT =
  "AI-generated estimate for bidding only. Requires licensed PE review.";

export const EXPORT_DOWNLOAD_LABELS: Record<ExportFormatOption["id"], string> = {
  pdf: "Download PDF Report",
  csv: "Download CSV Report",
  print: "Download Print Layout",
  email: "Send Report Link",
};

function getSquareFootage(squareFootage: string): string {
  const numeric = Number.parseInt(squareFootage.replace(/,/g, ""), 10);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "52,000";
  }

  return numeric.toLocaleString("en-US");
}

function getFloorCount(numberOfFloors: string): string {
  const count = Number.parseInt(numberOfFloors, 10);

  if (!Number.isFinite(count) || count <= 0) {
    return "4";
  }

  return String(count);
}

export function buildExportPreviewData(
  projectInfo: ProjectInfoFormData,
  results?: DesignResults,
): ExportPreviewData {
  const compliance = results?.compliance ?? MOCK_COMPLIANCE_RESULTS;
  const projectName = getProjectDisplayName(projectInfo);
  const address =
    projectInfo.address.trim() || "1200 Commerce Blvd, Houston, TX 77002";

  return {
    projectName,
    occupancy: formatOccupancyType(projectInfo.occupancyType),
    address,
    squareFootage: getSquareFootage(projectInfo.squareFootage),
    floors: getFloorCount(projectInfo.numberOfFloors),
    initiatingDevices: "42",
    notificationDevices: "28",
    controlDevices: "6",
    totalItems: String(results?.bomTotalItems ?? BOM_TOTAL_ITEMS),
    estimatedCable: "4,200 ft",
    estimatedConduit: "1,800 ft",
    complianceScore: `${compliance.score}%`,
    complianceStatus: compliance.statusLabel,
    flaggedItems: String(compliance.reviewCount),
  };
}

export function getExportPreviewSubtitle(projectInfo: ProjectInfoFormData): string {
  return getProjectDisplayName(projectInfo);
}
