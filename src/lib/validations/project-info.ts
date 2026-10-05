import { scopeRequiresCommunication } from "@/lib/constants/system-scope";
import type { ProjectInfoFormData } from "@/types/new-design";

export type ProjectInfoErrors = Partial<Record<keyof ProjectInfoFormData, string>>;

export interface ProjectInfoValidationResult {
  success: boolean;
  errors: ProjectInfoErrors;
  warnings: string[];
}

const ADDRESS_WITH_CITY_STATE_ZIP = /,\s*[^,]+,\s*[A-Za-z]{2}\s+\d{5}(-\d{4})?\s*$/;
const CODE_EDITION_YEAR = /^(19|20)\d{2}$/;
const EXISTING_SYSTEM_SCOPES = new Set(["addition_to_existing", "device_replacement_only"]);
const MIN_SQUARE_FOOTAGE = 100;
const MAX_SQUARE_FOOTAGE = 5_000_000;
const MAX_FLOORS = 150;
const MIN_AREA_PER_FLOOR = 100;
export const SPECIAL_NOTES_MAX_LENGTH = 2000;

function parseWholeNumber(rawValue: string): number | null {
  const normalized = rawValue.trim().replace(/,/g, "");
  return /^\d+$/.test(normalized) ? Number(normalized) : null;
}

export function validateProjectInfoForm(
  data: ProjectInfoFormData,
): ProjectInfoValidationResult {
  const errors: ProjectInfoErrors = {};
  const warnings: string[] = [];
  const projectName = data.projectName.trim();
  if (!projectName) {
    errors.projectName = "Project name is required";
  } else if (projectName.length < 3 || projectName.length > 200) {
    errors.projectName = "Use 3 to 200 characters";
  }
  if (!data.address.trim()) {
    errors.address = "Address is required";
  } else if (!ADDRESS_WITH_CITY_STATE_ZIP.test(data.address.trim())) {
    errors.address = "Add street, city, state and ZIP, e.g. 15668 N. Kirkbrae Ave, Nampa, ID 83651";
  }
  if (!data.jurisdiction.trim()) {
    errors.jurisdiction = "Enter the AHJ shown on the drawings or permit";
  }
  const editionLabels = { ibcEdition: "IBC", ifcEdition: "IFC", nfpa72Edition: "NFPA 72" } as const;
  for (const [editionFieldName, editionLabel] of Object.entries(editionLabels) as [keyof typeof editionLabels, string][]) {
    const editionValue = (data[editionFieldName] ?? "").trim();
    if (!editionValue) {
      errors[editionFieldName] = `${editionLabel} edition is required`;
    } else if (!CODE_EDITION_YEAR.test(editionValue)) {
      errors[editionFieldName] = "Enter a 4-digit year, e.g. 2018";
    }
  }
  const squareFootage = parseWholeNumber(data.squareFootage);
  if (!data.squareFootage.trim()) {
    errors.squareFootage = "Square footage is required";
  } else if (squareFootage === null) {
    errors.squareFootage = "Enter a whole number of square feet";
  } else if (squareFootage < MIN_SQUARE_FOOTAGE || squareFootage > MAX_SQUARE_FOOTAGE) {
    errors.squareFootage = "Enter between 100 and 5,000,000 ft²";
  }
  const floorCount = parseWholeNumber(data.numberOfFloors);
  if (!data.numberOfFloors.trim()) {
    errors.numberOfFloors = "Number of floors is required";
  } else if (floorCount === null || floorCount < 1 || floorCount > MAX_FLOORS) {
    errors.numberOfFloors = "Enter a whole number from 1 to 150";
  } else if (squareFootage !== null && squareFootage / floorCount < MIN_AREA_PER_FLOOR) {
    errors.numberOfFloors = `${squareFootage.toLocaleString()} ft² over ${floorCount} floors looks wrong. Check both values`;
  }
  if (!data.occupancyType) {
    errors.occupancyType = "Occupancy classification is required";
  }
  if (!data.systemScope) {
    errors.systemScope = "Scope of work is required";
  } else if (scopeRequiresCommunication(data.systemScope) && !data.monitoringCommunicationType) {
    errors.monitoringCommunicationType = "Monitoring communication type is required for a monitoring system";
  }
  if (EXISTING_SYSTEM_SCOPES.has(data.systemScope) && data.specialNotes.trim().length < 10) {
    errors.specialNotes = "Describe the existing panel (make, model, spare capacity)";
  }
  if (data.specialNotes.length > SPECIAL_NOTES_MAX_LENGTH) {
    errors.specialNotes = `Keep notes under ${SPECIAL_NOTES_MAX_LENGTH} characters`;
  }
  const occupancy = data.occupancyType;
  if (occupancy === "R-2" && floorCount !== null && floorCount > 2 && !data.optionalSystems.sprinkler) {
    warnings.push("R-2 buildings over 2 stories are usually sprinklered. Confirm the sprinkler setting.");
  }
  if (occupancy.startsWith("A-") && squareFootage !== null && squareFootage > 12000 && !data.optionalSystems.sprinkler) {
    warnings.push("Assembly areas over 12,000 ft² usually require sprinklers (IBC 903.2.1). Confirm the sprinkler setting.");
  }
  if (occupancy.startsWith("A-") && squareFootage !== null && squareFootage > 15000 && !data.optionalSystems.voiceEvacuation) {
    warnings.push("Large assembly occupancies may need emergency voice/alarm communication (IBC 907.2.1.1). Confirm with the AHJ.");
  }
  return { success: Object.keys(errors).length === 0, errors, warnings };
}

export function getProjectInfoChecklistState(data: ProjectInfoFormData) {
  return {
    address: Boolean(data.address.trim()),
    jurisdiction: Boolean(data.jurisdiction.trim()),
    occupancy: Boolean(data.occupancyType),
    scope: Boolean(data.systemScope),
    "square-footage": Boolean(data.squareFootage.trim()),
    floors: Boolean(data.numberOfFloors.trim()),
  };
}
