import type { SelectOption } from "@/components/ui/select";

export interface SystemScopeOption extends SelectOption {
  description: string;
}

export const FULL_PROTECTIVE_SIGNALING = "full_protective_signaling";
export const SPRINKLER_MONITORING_ONLY = "sprinkler_monitoring_only";

export const SYSTEM_SCOPE_OPTIONS: SystemScopeOption[] = [
  {
    value: FULL_PROTECTIVE_SIGNALING,
    label: "Full protective signaling system",
    description:
      "Building-wide detection and notification. Use when the code requires a complete fire alarm system.",
  },
  {
    value: SPRINKLER_MONITORING_ONLY,
    label: "Sprinkler monitoring only",
    description:
      "Waterflow and tamper supervision, fan shutdown on waterflow, and off-premises transmission. No area detection.",
  },
  {
    value: "manual_system_only",
    label: "Manual system only",
    description:
      "Pull stations and notification appliances, without area smoke detection.",
  },
  {
    value: "addition_to_existing",
    label: "Addition to an existing system",
    description: "New devices tied into a panel that is already installed.",
  },
  {
    value: "device_replacement_only",
    label: "Device replacement only",
    description: "Like-for-like device swaps on the existing panel.",
  },
];

export const COMMUNICATION_TYPE_OPTIONS: SelectOption[] = [
  { value: "cellular", label: "Cellular" },
  { value: "radio", label: "AES Radio" },
  { value: "copper_phone_line", label: "Copper Phone Line" },
  { value: "ip_network", label: "IP network" },
  { value: "none", label: "No off-premises monitoring" },
];

export const MANUFACTURER_OPTIONS: SelectOption[] = [
  { value: "notifier", label: "Notifier" },
  { value: "silent_knight", label: "Silent Knight" },
  { value: "fire_lite", label: "Fire-Lite" },
  { value: "gamewell_fci", label: "Gamewell-FCI" },
  { value: "system_sensor", label: "System Sensor" },
  { value: "simplex", label: "Simplex" },
  { value: "edwards_est", label: "Edwards (EST)" },
  { value: "kidde", label: "Kidde" },
  { value: "siemens", label: "Siemens Fire Safety" },
  { value: "potter", label: "Potter Electric Signal" },
  { value: "hochiki", label: "Hochiki America" },
  { value: "mircom", label: "Mircom" },
  { value: "bosch", label: "Bosch" },
  { value: "gentex", label: "Gentex" },
];

export const PANEL_FAMILY_OPTIONS: SelectOption[] = [
  { value: "AFC Series", label: "AFC Series" },
  { value: "MS-9200UDLS", label: "MS-9200UDLS" },
  { value: "NFS-320", label: "NFS-320" },
  { value: "NFS2-3030", label: "NFS2-3030" },
  { value: "IFP-2100", label: "IFP-2100" },
  { value: "EST3", label: "EST3" },
  { value: "4100ES", label: "4100ES" },
];

const SCOPE_LABEL_BY_VALUE = new Map(
  SYSTEM_SCOPE_OPTIONS.map((option) => [option.value, option.label]),
);

export function formatSystemScope(value: string | null | undefined): string {
  if (!value) {
    return "Full protective signaling system";
  }
  return SCOPE_LABEL_BY_VALUE.get(value) ?? value;
}

export function scopeRequiresCommunication(scopeValue: string): boolean {
  return scopeValue === SPRINKLER_MONITORING_ONLY;
}
