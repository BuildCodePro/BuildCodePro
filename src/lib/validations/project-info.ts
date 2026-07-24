import type { ProjectInfoFormData } from "@/types/new-design";

export interface ProjectInfoValidationResult {
  success: boolean;
  errors: Partial<Record<keyof ProjectInfoFormData, string>>;
}

export function validateProjectInfoForm(
  data: ProjectInfoFormData,
): ProjectInfoValidationResult {
  const errors: Partial<Record<keyof ProjectInfoFormData, string>> = {};

  if (!data.projectName.trim()) {
    errors.projectName = "Project name is required";
  }

  if (!data.address.trim()) {
    errors.address = "Address is required";
  }

  if (!data.jurisdiction.trim()) {
    errors.jurisdiction = "Jurisdiction is required";
  }

  if (!data.squareFootage.trim()) {
    errors.squareFootage = "Square footage is required";
  } else if (!/^\d+([.,]\d+)?$/.test(data.squareFootage.trim().replace(/,/g, ""))) {
    errors.squareFootage = "Enter a valid number";
  }

  if (!data.numberOfFloors.trim()) {
    errors.numberOfFloors = "Number of floors is required";
  } else if (!/^\d+$/.test(data.numberOfFloors.trim())) {
    errors.numberOfFloors = "Enter a valid whole number";
  }

  if (!data.occupancyType) {
    errors.occupancyType = "Occupancy type is required";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

export function getProjectInfoChecklistState(data: ProjectInfoFormData) {
  return {
    address: Boolean(data.address.trim()),
    jurisdiction: Boolean(data.jurisdiction.trim()),
    occupancy: Boolean(data.occupancyType),
    "square-footage": Boolean(data.squareFootage.trim()),
    floors: Boolean(data.numberOfFloors.trim()),
  };
}
