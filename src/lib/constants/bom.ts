import type { BomCategory, BomLineItem } from "@/types/new-design";

export const BOM_TOTAL_ITEMS = 84;

export const BOM_CATEGORIES: BomCategory[] = [
  {
    id: "devices",
    label: "Devices",
    items: [
      {
        id: "smoke-detector",
        item: "Addressable Smoke Detector",
        category: "Smoke Detectors",
        qty: 36,
        unit: "EA",
        notes: "Ceiling mount, photo-electric",
        confidence: 96,
      },
      {
        id: "pull-station",
        item: "Manual Pull Station",
        category: "Initiating Devices",
        qty: 12,
        unit: "EA",
        notes: "Surface mount, red",
        confidence: 94,
      },
      {
        id: "horn-strobe",
        item: "Horn/Strobe, Red",
        category: "Notification",
        qty: 24,
        unit: "EA",
        notes: "15/75cd, wall mount",
        confidence: 92,
      },
      {
        id: "speaker-strobe",
        item: "Speaker/Strobe",
        category: "Notification",
        qty: 8,
        unit: "EA",
        notes: "Voice evac, ceiling",
        confidence: 89,
      },
      {
        id: "duct-smoke",
        item: "Duct Smoke Detector",
        category: "Duct Detectors",
        qty: 4,
        unit: "EA",
        notes: "HVAC return/supply",
        confidence: 91,
      },
      {
        id: "heat-detector",
        item: "Heat Detector",
        category: "Initiating Devices",
        qty: 6,
        unit: "EA",
        notes: "ROR, 135°F",
        confidence: 93,
      },
    ],
  },
  {
    id: "wiring",
    label: "Wiring",
    items: [
      {
        id: "shielded-cable",
        item: "2-Wire Shielded Cable",
        category: "Wiring",
        qty: 3200,
        unit: "FT",
        notes: "18 AWG, plenum rated",
        confidence: 88,
      },
      {
        id: "facp-cable",
        item: "FACP Communication Cable",
        category: "Wiring",
        qty: 800,
        unit: "FT",
        notes: "RS-485, twisted pair",
        confidence: 91,
      },
      {
        id: "nac-cable",
        item: "NAC Circuit Cable",
        category: "Wiring",
        qty: 1200,
        unit: "FT",
        notes: "16 AWG, 2-conductor",
        confidence: 90,
      },
      {
        id: "idc-cable",
        item: "IDC Loop Cable",
        category: "Wiring",
        qty: 2400,
        unit: "FT",
        notes: "18 AWG, addressable loop",
        confidence: 92,
      },
    ],
  },
  {
    id: "conduit",
    label: "Conduit",
    items: [
      {
        id: "emt-half",
        item: 'EMT Conduit 1/2"',
        category: "Conduit",
        qty: 1800,
        unit: "FT",
        notes: "Galvanized steel, ceiling run",
        confidence: 90,
      },
      {
        id: "emt-three-quarter",
        item: 'EMT Conduit 3/4"',
        category: "Conduit",
        qty: 600,
        unit: "FT",
        notes: "Main riser, multi-circuit",
        confidence: 87,
      },
      {
        id: "couplings",
        item: "EMT Couplings",
        category: "Conduit Fittings",
        qty: 120,
        unit: "EA",
        notes: '1/2" and 3/4" mixed',
        confidence: 95,
      },
      {
        id: "straps",
        item: "Conduit Straps",
        category: "Conduit Fittings",
        qty: 240,
        unit: "EA",
        notes: "One-hole, steel",
        confidence: 94,
      },
    ],
  },
  {
    id: "control-equipment",
    label: "Control Equipment",
    items: [
      {
        id: "facp",
        item: "Fire Alarm Control Panel",
        category: "Control",
        qty: 1,
        unit: "EA",
        notes: "Addressable, 250-point capacity",
        confidence: 95,
      },
      {
        id: "annunciator",
        item: "Annunciator Panel",
        category: "Control",
        qty: 2,
        unit: "EA",
        notes: "LCD remote annunciator",
        confidence: 90,
      },
      {
        id: "nac-power",
        item: "NAC Power Supply",
        category: "Control",
        qty: 2,
        unit: "EA",
        notes: "6.5A, 24VDC booster",
        confidence: 92,
      },
      {
        id: "battery",
        item: "Standby Battery Set",
        category: "Control",
        qty: 2,
        unit: "EA",
        notes: "12V 18Ah, sealed lead-acid",
        confidence: 91,
      },
    ],
  },
];

export function getBomItemsByCategory(categoryId: BomCategory["id"]): BomLineItem[] {
  return BOM_CATEGORIES.find((category) => category.id === categoryId)?.items ?? [];
}

export function getBomCategoryLabel(categoryId: BomCategory["id"]): string {
  return BOM_CATEGORIES.find((category) => category.id === categoryId)?.label ?? "";
}
