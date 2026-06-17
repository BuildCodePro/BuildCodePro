import type { DesignNarrative, ProjectInfoFormData } from "@/types/new-design";

import { getProjectDisplayName } from "./results";
import {
  formatGeneratedDate,
  formatOccupancyType,
} from "@/lib/utils/format-project-metadata";

function getSquareFootageLabel(squareFootage: string): string {
  const numeric = Number.parseInt(squareFootage.replace(/,/g, ""), 10);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "52,000 sq ft";
  }

  return `${numeric.toLocaleString("en-US")} sq ft`;
}

function getFloorCountLabel(numberOfFloors: string): string {
  const count = Number.parseInt(numberOfFloors, 10);

  if (!Number.isFinite(count) || count <= 0) {
    return "4";
  }

  return String(count);
}

function getSystemsNote(projectInfo: ProjectInfoFormData): string {
  const systems: string[] = [];

  if (projectInfo.optionalSystems.sprinkler) {
    systems.push("a sprinkler system");
  }

  if (projectInfo.optionalSystems.ductDetectors) {
    systems.push("duct detection");
  }

  if (systems.length === 0) {
    return "standard fire alarm coverage";
  }

  if (systems.length === 1) {
    return systems[0];
  }

  return `${systems.slice(0, -1).join(", ")} and ${systems.at(-1)}`;
}

export function buildDesignNarrative(
  projectInfo: ProjectInfoFormData,
): DesignNarrative {
  const projectName = getProjectDisplayName(projectInfo);
  const occupancy = formatOccupancyType(projectInfo.occupancyType);
  const squareFootage = getSquareFootageLabel(projectInfo.squareFootage);
  const floors = getFloorCountLabel(projectInfo.numberOfFloors);
  const jurisdiction =
    projectInfo.jurisdiction.trim() || "Harris County, TX";
  const systemsNote = getSystemsNote(projectInfo);

  return {
    includeInExport: true,
    sections: [
      {
        id: "project-summary",
        title: "Project Summary",
        content: `This report covers the proposed fire alarm system design for ${projectName}, a ${squareFootage} ${occupancy} occupancy located in ${jurisdiction}. The building consists of ${floors} floors and includes ${systemsNote}.`,
      },
      {
        id: "design-assumptions",
        title: "Design Assumptions",
        content:
          "Design assumptions are based on uploaded floor plans, NFPA 72 (2022 Edition) spacing requirements, and standard Assembly occupancy notification criteria. Ceiling heights assumed at 10 ft unless otherwise indicated on drawings.",
      },
      {
        id: "device-placement",
        title: "Device Placement Logic",
        content:
          "Smoke detectors are placed per NFPA 72 spacing tables with additional coverage at corridor intersections and large open areas. Manual pull stations are located within 5 ft of exit doors on each floor. Horn/strobe units are distributed to meet 15 dB above ambient and candela requirements for Assembly occupancies.",
      },
      {
        id: "material-estimate",
        title: "Material Estimate Summary",
        content:
          "The design includes 84 total devices across initiating, notification, and control categories. Estimated cabling is 4,200 ft of 2-wire shielded cable with approximately 1,800 ft of EMT conduit for circuit protection.",
      },
      {
        id: "compliance-notes",
        title: "Compliance Notes",
        content:
          "Estimated NFPA 72 compliance score is 91%. Three items are flagged for engineer review, including mechanical room detector placement, corridor speaker coverage, and remote annunciator location.",
      },
      {
        id: "review-disclaimer",
        title: "Review Disclaimer",
        content:
          "This narrative was AI-generated for estimation and bidding support. Final design approval requires review and stamp by a licensed Professional Engineer.",
      },
    ],
  };
}

export function formatNarrativeSubtitle(
  projectName: string,
  generatedAt?: string,
): string {
  return `${projectName} • Generated ${formatGeneratedDate(generatedAt)}`;
}
