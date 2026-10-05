import { OCCUPANCY_OPTIONS } from "@/lib/constants/occupancy";
import type { ProjectInfoFormData } from "@/types/new-design";
import type { IntakeField, IntakeFieldSource, ProjectIntakeResult } from "@/types/project-intake";

export const INTAKE_LOW_CONFIDENCE = 0.75;

const hasValue = <ValueType,>(field: IntakeField<ValueType> | undefined): field is IntakeField<ValueType> & { value: ValueType } =>
  Boolean(field) && field?.value !== null && field?.value !== undefined && field?.value !== "";

const sourceOf = (field: IntakeField<unknown>): IntakeFieldSource => ({
  sourceLabel: field.source_sheet ? `From ${field.source_sheet}` : field.source_page ? `From page ${field.source_page}` : "From drawings",
  confidence: field.confidence,
  reviewNote: field.review_note ?? null,
});

export function composeIntakeAddress(result: ProjectIntakeResult): string {
  const cityStateZip = [result.city.value, [result.state.value, result.zip_code.value].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return [result.street_address.value, cityStateZip].filter(Boolean).join(", ");
}

function matchOccupancy(rawOccupancy: string): string | null {
  const normalizedOccupancy = rawOccupancy.trim().toUpperCase().replace(/\s+/g, "");
  return OCCUPANCY_OPTIONS.find((option) => option.value.toUpperCase() === normalizedOccupancy)?.value ?? null;
}

export function applyIntakeToProjectInfo(
  current: ProjectInfoFormData,
  result: ProjectIntakeResult,
): { projectInfo: ProjectInfoFormData; fieldSources: Partial<Record<keyof ProjectInfoFormData, IntakeFieldSource>> } {
  const projectInfo: ProjectInfoFormData = { ...current, optionalSystems: { ...current.optionalSystems } };
  const fieldSources: Partial<Record<keyof ProjectInfoFormData, IntakeFieldSource>> = {};
  if (!current.projectName.trim() && hasValue(result.project_name)) {
    projectInfo.projectName = result.project_name.value;
    fieldSources.projectName = sourceOf(result.project_name);
  }
  const intakeAddress = composeIntakeAddress(result);
  if (!current.address.trim() && intakeAddress) {
    projectInfo.address = intakeAddress;
    const addressConfidence = Math.min(...[result.street_address, result.city, result.state, result.zip_code].map((field) => field.confidence));
    fieldSources.address = { ...sourceOf(result.street_address), confidence: addressConfidence };
  }
  if (!current.jurisdiction.trim() && hasValue(result.ahj)) {
    projectInfo.jurisdiction = result.ahj.value;
    fieldSources.jurisdiction = sourceOf(result.ahj);
  } else if (!current.jurisdiction.trim() && result.ahj?.review_note) {
    fieldSources.jurisdiction = sourceOf(result.ahj);
  }
  const editionFields = [
    ["ibcEdition", result.ibc_edition],
    ["ifcEdition", result.ifc_edition],
    ["nfpa72Edition", result.nfpa72_edition],
  ] as const;
  for (const [formFieldName, intakeField] of editionFields) {
    if ((current[formFieldName] ?? "").trim() || !intakeField) continue;
    if (hasValue(intakeField)) projectInfo[formFieldName] = intakeField.value;
    if (hasValue(intakeField) || intakeField.review_note) fieldSources[formFieldName] = sourceOf(intakeField);
  }
  if (!current.squareFootage.trim() && hasValue(result.square_footage)) {
    projectInfo.squareFootage = String(Math.round(result.square_footage.value));
    fieldSources.squareFootage = sourceOf(result.square_footage);
  }
  if (!current.numberOfFloors.trim() && hasValue(result.number_of_floors)) {
    projectInfo.numberOfFloors = String(Math.round(result.number_of_floors.value));
    fieldSources.numberOfFloors = sourceOf(result.number_of_floors);
  }
  const occupancyValue = hasValue(result.occupancy_classification) ? matchOccupancy(result.occupancy_classification.value) : null;
  if (!current.occupancyType && occupancyValue) {
    projectInfo.occupancyType = occupancyValue;
    fieldSources.occupancyType = sourceOf(result.occupancy_classification);
  }
  if (hasValue(result.sprinkler_system) && result.sprinkler_system.value && !current.optionalSystems.sprinkler) {
    projectInfo.optionalSystems.sprinkler = true;
    fieldSources.optionalSystems = sourceOf(result.sprinkler_system);
  }
  return { projectInfo, fieldSources };
}
