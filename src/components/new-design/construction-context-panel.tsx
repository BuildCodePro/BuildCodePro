import { Check, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatSystemScope } from "@/lib/constants/system-scope";
import type { ConstructionExtract } from "@/services/analysisService";
import type { ProjectInfoFormData } from "@/types/new-design";

interface ConstructionContextPanelProps {
  projectInfo: ProjectInfoFormData;
  hasDrawings: boolean;
  constructionExtract?: ConstructionExtract | null;
}

interface ContextRow {
  label: string;
  value: string;
  status: "detected" | "from_project" | "pending";
}

function rowStatusLabel(status: ContextRow["status"]): string {
  if (status === "detected") {
    return "Detected";
  }
  if (status === "from_project") {
    return "From project";
  }
  return "Pending";
}

function occupancyRow(
  projectInfo: ProjectInfoFormData,
  constructionExtract?: ConstructionExtract | null,
): ContextRow {
  if (constructionExtract?.occupancy_found && constructionExtract.occupancy_type) {
    return {
      label: "Occupancy classification",
      value: constructionExtract.occupancy_type,
      status: "detected",
    };
  }
  return {
    label: "Occupancy classification",
    value: projectInfo.occupancyType || "—",
    status: projectInfo.occupancyType ? "from_project" : "pending",
  };
}

function booleanRow(
  label: string,
  projectValue: boolean,
  found: boolean | undefined,
  extractedValue: boolean | undefined,
  hasDrawings: boolean,
): ContextRow {
  if (found) {
    return {
      label,
      value: extractedValue ? "Yes" : "No",
      status: "detected",
    };
  }
  return {
    label,
    value: projectValue ? "Yes" : "No",
    status: hasDrawings ? "from_project" : "pending",
  };
}

export function ConstructionContextPanel({
  projectInfo,
  hasDrawings,
  constructionExtract,
}: ConstructionContextPanelProps) {
  const rows: ContextRow[] = [
    occupancyRow(projectInfo, constructionExtract),
    {
      label: "Number of floors",
      value: projectInfo.numberOfFloors || "—",
      status: projectInfo.numberOfFloors ? "from_project" : "pending",
    },
    booleanRow(
      "Elevator presence",
      projectInfo.optionalSystems.elevator,
      constructionExtract?.elevator_found,
      constructionExtract?.elevator,
      hasDrawings,
    ),
    booleanRow(
      "Sprinkler system",
      projectInfo.optionalSystems.sprinkler,
      constructionExtract?.sprinkler_found,
      constructionExtract?.sprinkler_system,
      hasDrawings,
    ),
    booleanRow(
      "Duct detectors",
      projectInfo.optionalSystems.ductDetectors,
      constructionExtract?.duct_found,
      constructionExtract?.duct_detectors,
      hasDrawings,
    ),
    {
      label: "System scope",
      value: formatSystemScope(projectInfo.systemScope),
      status: projectInfo.systemScope ? "from_project" : "pending",
    },
  ];

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-section-title font-body">
            Extracted construction context
          </h3>
          <p className="font-body text-sm text-stat-label">
            Occupancy, elevators, and sprinklers come from the drawings when
            analysis finds them. Until then these are project hints.
          </p>
        </div>
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-[10px] border border-border px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="font-body text-xs text-stat-label">{row.label}</p>
                <p className="font-body text-sm font-medium text-foreground">
                  {row.value}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 font-body text-xs text-stat-label">
                {row.status === "pending" ? (
                  <Circle className="size-3.5 text-slate-300" aria-hidden="true" />
                ) : (
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                )}
                {rowStatusLabel(row.status)}
              </span>
            </li>
          ))}
        </ul>
        {constructionExtract?.occupancy_evidence ? (
          <p className="font-body text-xs text-stat-label">
            Occupancy evidence: {constructionExtract.occupancy_evidence}
          </p>
        ) : null}
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5">
          <p className="font-body text-xs text-sky-800">
            Extracted from drawings during analysis — not extra IBC/IFC fields
            on Project Info.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
