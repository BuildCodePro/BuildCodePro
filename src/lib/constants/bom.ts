export const BOM_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "initiating_devices", label: "Initiating Devices" },
  { id: "wiring", label: "Wiring" },
  { id: "conduit", label: "Conduit" },
  { id: "notification_appliances", label: "Notification Appliances" },
  { id: "control_equipment", label: "Control Equipment" },
] as const;

export type BomCategoryId = (typeof BOM_CATEGORIES)[number]["id"];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  wiring: "Wiring",
  conduit: "Conduit",
  initiating_devices: "Initiating Devices",
  notification_appliances: "Notification Appliances",
  control_equipment: "Control Equipment",
};

/**
 * Returns a human-readable label for a category id. Falls back to a
 * title-cased version of the raw id if it's not one we already know about,
 * so new categories added by the API don't break the UI.
 */
export function getBomCategoryLabel(categoryId: string): string {
  if (CATEGORY_LABELS[categoryId]) {
    return CATEGORY_LABELS[categoryId];
  }

  return categoryId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}