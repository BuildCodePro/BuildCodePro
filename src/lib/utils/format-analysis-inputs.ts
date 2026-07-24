import type { ProjectInfoFormData, UploadedFile } from "@/types/new-design";

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

export interface AnalysisInputRow {
  label: string;
  value: string;
}

function formatIncluded(included: boolean): string {
  return included ? "Yes — Included" : "No — Not included";
}

function formatFileCount(files: UploadedFile[]): string {
  const count = files.length;
  const pdfCount = files.filter((file) => file.type === "application/pdf").length;
  const suffix = count === 1 ? "file" : "files";

  if (pdfCount === count) {
    return `${count} PDF ${suffix}`;
  }

  return `${count} ${suffix}`;
}

function formatOccupancyType(occupancyType: string): string {
  if (!occupancyType) {
    return "—";
  }

  const code = OCCUPANCY_TYPE_CODES[occupancyType];
  return code ? `${occupancyType} (${code})` : occupancyType;
}

function formatFloors(floors: string): string {
  const count = Number.parseInt(floors, 10);

  if (!Number.isFinite(count) || count <= 0) {
    return floors || "—";
  }

  return `${count} floor${count === 1 ? "" : "s"}`;
}

function formatSquareFootage(squareFootage: string): string {
  const numeric = Number.parseInt(squareFootage.replace(/,/g, ""), 10);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return squareFootage || "—";
  }

  return `${numeric.toLocaleString("en-US")} sq ft`;
}

export function getAnalysisInputRows(
  files: UploadedFile[],
  projectInfo: ProjectInfoFormData,
): AnalysisInputRow[] {
  return [
    { label: "Files Uploaded", value: formatFileCount(files) },
    {
      label: "Occupancy Type",
      value: formatOccupancyType(projectInfo.occupancyType),
    },
    {
      label: "Floors",
      value: formatFloors(projectInfo.numberOfFloors),
    },
    {
      label: "Square Footage",
      value: formatSquareFootage(projectInfo.squareFootage),
    },
    {
      label: "Jurisdiction",
      value: projectInfo.jurisdiction || "—",
    },
    {
      label: "Sprinkler System",
      value: formatIncluded(projectInfo.optionalSystems.sprinkler),
    },
    {
      label: "Duct Detectors",
      value: formatIncluded(projectInfo.optionalSystems.ductDetectors),
    },
  ];
}
