export const OCCUPANCY_TYPES = [
  "Assembly",
  "Business",
  "Residential",
  "Educational",
  "Industrial",
  "Mercantile",
  "Storage",
  "Utility",
] as const;

export const OPTIONAL_SYSTEM_OPTIONS = [
  {
    id: "sprinkler" as const,
    label: "Sprinkler System",
    description: "Include sprinkler coverage in design",
  },
  {
    id: "elevator" as const,
    label: "Elevator",
    description: "Elevator recall and recall alternate",
  },
  {
    id: "ductDetectors" as const,
    label: "Duct Detectors",
    description: "HVAC duct smoke detectors",
  },
  {
    id: "voiceEvacuation" as const,
    label: "Voice Evacuation",
    description: "Mass notification / voice evac system",
  },
];
