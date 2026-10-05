import type { SelectOption } from "@/components/ui/select";

export const OCCUPANCY_OPTIONS: SelectOption[] = [
  { value: "A-1", label: "A-1 — Assembly, fixed seating (theaters)" },
  { value: "A-2", label: "A-2 — Assembly, food or drink (restaurants, bars)" },
  { value: "A-3", label: "A-3 — Assembly, worship, recreation, amusement" },
  { value: "A-4", label: "A-4 — Assembly, indoor sporting events" },
  { value: "A-5", label: "A-5 — Assembly, outdoor grandstands" },
  { value: "B", label: "B — Business (offices, clinics, banks)" },
  { value: "E", label: "E — Educational (through 12th grade)" },
  { value: "F-1", label: "F-1 — Factory, moderate hazard" },
  { value: "F-2", label: "F-2 — Factory, low hazard" },
  { value: "H-1", label: "H-1 — High hazard, detonation" },
  { value: "H-2", label: "H-2 — High hazard, deflagration" },
  { value: "H-3", label: "H-3 — High hazard, readily combustible" },
  { value: "H-4", label: "H-4 — High hazard, health hazard" },
  { value: "H-5", label: "H-5 — High hazard, semiconductor fabrication" },
  { value: "I-1", label: "I-1 — Institutional, assisted living" },
  { value: "I-2", label: "I-2 — Institutional, medical care (hospitals)" },
  { value: "I-3", label: "I-3 — Institutional, restrained (detention)" },
  { value: "I-4", label: "I-4 — Institutional, day care" },
  { value: "M", label: "M — Mercantile (retail)" },
  { value: "R-1", label: "R-1 — Residential, transient (hotels)" },
  { value: "R-2", label: "R-2 — Residential, multi-family (apartments)" },
  { value: "R-3", label: "R-3 — Residential, one and two family" },
  { value: "R-4", label: "R-4 — Residential, care facilities" },
  { value: "S-1", label: "S-1 — Storage, moderate hazard" },
  { value: "S-2", label: "S-2 — Storage, low hazard" },
  { value: "U", label: "U — Utility and miscellaneous" },
  { value: "mixed", label: "Mixed occupancy" },
];

const OCCUPANCY_LABEL_BY_VALUE = new Map(
  OCCUPANCY_OPTIONS.map((option) => [option.value, option.label]),
);

export function formatOccupancyClassification(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }
  return OCCUPANCY_LABEL_BY_VALUE.get(value) ?? value;
}
