import { FULL_PROTECTIVE_SIGNALING } from "@/lib/constants/system-scope";
import { validateProjectInfoForm } from "@/lib/validations/project-info";
import type { CreateProjectDto, ProjectDto } from "@/services/projectService";
import type { ProjectInfoFormData } from "@/types/new-design";

// Shape of a structured API error payload, e.g.:
// { error_code: "DESIGN_QUOTA_EXCEEDED", message: "...", used: 14, limit: 5 }
export interface ApiErrorPayload {
  error_code?: string;
  message?: string;
  used?: number;
  limit?: number;
  timestamp?: string;
}

// Errors can arrive in different shapes depending on the client/fetch
// wrapper (error.data, error.response.data, or the error itself already
// being the parsed payload). This normalizes all of them.
export function extractApiErrorPayload(error: unknown): ApiErrorPayload | null {
  if (!error) return null;

  const errorRecord = error as { data?: unknown; response?: { data?: unknown } };
  const candidate =
    errorRecord?.data ??
    errorRecord?.response?.data ??
    (typeof error === "object" ? error : null);

  if (candidate && typeof candidate === "object" && "error_code" in candidate) {
    return candidate as ApiErrorPayload;
  }

  return null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  const payload = extractApiErrorPayload(error);
  if (payload?.message) return payload.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function validateProjectInfo(
  info: ProjectInfoFormData,
): Partial<Record<keyof ProjectInfoFormData, string>> {
  return validateProjectInfoForm(info).errors;
}

export function buildProjectPayload(projectInfo: ProjectInfoFormData): CreateProjectDto {
  return {
    name: projectInfo.projectName,
    address: projectInfo.address,
    jurisdiction: projectInfo.jurisdiction,
    ibc_edition: projectInfo.ibcEdition.trim() || undefined,
    ifc_edition: projectInfo.ifcEdition.trim() || undefined,
    nfpa72_edition: projectInfo.nfpa72Edition.trim() || undefined,
    square_footage: parseInt(projectInfo.squareFootage) || 0,
    number_of_floors: parseInt(projectInfo.numberOfFloors) || 1,
    occupancy_type: projectInfo.occupancyType,
    system_scope: projectInfo.systemScope,
    bid_to_minimum_code: projectInfo.bidToMinimumCode,
    monitoring_communication_type:
      projectInfo.monitoringCommunicationType || undefined,
    preferred_manufacturer: projectInfo.preferredManufacturer || undefined,
    preferred_panel_family: projectInfo.preferredPanelFamily || undefined,
    sprinkler_system: projectInfo.optionalSystems.sprinkler,
    elevator: projectInfo.optionalSystems.elevator,
    duct_detectors: projectInfo.optionalSystems.ductDetectors,
    voice_evacuation: projectInfo.optionalSystems.voiceEvacuation,
    special_notes: projectInfo.specialNotes,
  };
}

// Maps a single-project API response into the wizard's form shape.
export function mapProjectResponseToFormData(project: Partial<ProjectDto> | undefined): ProjectInfoFormData {
  return {
    projectName: project?.name ?? "",
    address: project?.address ?? "",
    jurisdiction: project?.jurisdiction ?? "",
    ibcEdition: project?.ibc_edition ?? "",
    ifcEdition: project?.ifc_edition ?? "",
    nfpa72Edition: project?.nfpa72_edition ?? "",
    squareFootage:
      project?.square_footage != null ? String(project.square_footage) : "",
    numberOfFloors:
      project?.number_of_floors != null
        ? String(project.number_of_floors)
        : "",
    occupancyType: project?.occupancy_type ?? "",
    systemScope: project?.system_scope ?? FULL_PROTECTIVE_SIGNALING,
    monitoringCommunicationType: project?.monitoring_communication_type ?? "",
    preferredManufacturer: project?.preferred_manufacturer ?? "",
    preferredPanelFamily: project?.preferred_panel_family ?? "",
    bidToMinimumCode: project?.bid_to_minimum_code ?? true,
    optionalSystems: {
      sprinkler: Boolean(project?.sprinkler_system),
      elevator: Boolean(project?.elevator),
      ductDetectors: Boolean(project?.duct_detectors),
      voiceEvacuation: Boolean(project?.voice_evacuation),
    },
    specialNotes: project?.special_notes ?? "",
  };
}
