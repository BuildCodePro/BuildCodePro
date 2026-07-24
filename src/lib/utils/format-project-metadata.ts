import type { ProjectInfoFormData } from "@/types/new-design";

const OCCUPANCY_TYPE_CODES: Record<string, string> = {
  assembly: "A-2",
  Business: "B",
  Residential: "R-2",
  Educational: "E",
  Industrial: "F-1",
  Mercantile: "M",
  Storage: "S-1",
  Utility: "U",
};

export function formatOccupancyType(occupancyType: string): string {
  if (!occupancyType) {
    return "assembly (A-2)";
  }

  const code = OCCUPANCY_TYPE_CODES[occupancyType];
  return code ? `${occupancyType} (${code})` : occupancyType;
}

function formatFloors(floors: string): string {
  const count = Number.parseInt(floors, 10);

  if (!Number.isFinite(count) || count <= 0) {
    return "4 Floors";
  }

  return `${count} Floor${count === 1 ? "" : "s"}`;
}

function formatSquareFootage(squareFootage: string): string {
  const numeric = Number.parseInt(squareFootage.replace(/,/g, ""), 10);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "52,000 sq ft";
  }

  return `${numeric.toLocaleString("en-US")} sq ft`;
}

export function formatProjectMetadata(
  projectInfo: ProjectInfoFormData,
): string {
  const jurisdiction =
    projectInfo.jurisdiction.trim() || "Harris County, TX";

  return [
    formatOccupancyType(projectInfo.occupancyType),
    formatSquareFootage(projectInfo.squareFootage),
    formatFloors(projectInfo.numberOfFloors),
    jurisdiction,
  ].join(" • ");
}

export function formatComplianceSubtitle(
  projectInfo: ProjectInfoFormData,
  projectName: string,
): string {
  const jurisdiction =
    projectInfo.jurisdiction.trim() || "Harris County, TX";

  return `${projectName} • ${jurisdiction} • ${formatOccupancyType(projectInfo.occupancyType)}`;
}

export function formatGeneratedDate(dateInput?: string | Date): string {
  const date = dateInput
    ? new Date(dateInput)
    : new Date();

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
