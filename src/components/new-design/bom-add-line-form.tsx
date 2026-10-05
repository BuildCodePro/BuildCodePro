"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BomLineCreatePayload } from "@/types/bom";

const CATEGORY_OPTIONS: { value: BomLineCreatePayload["category"]; label: string }[] = [
  { value: "initiating_devices", label: "Initiating Devices" },
  { value: "notification_appliances", label: "Notification Appliances" },
  { value: "control_equipment", label: "Control Equipment" },
  { value: "wiring", label: "Wiring" },
  { value: "conduit", label: "Conduit" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

interface BomAddLineFormProps {
  onSubmit: (payload: BomLineCreatePayload) => Promise<void>;
  onCancel: () => void;
}

function toDeviceType(deviceName: string): string {
  return deviceName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 100) || "manual_item";
}

export function BomAddLineForm({ onSubmit, onCancel }: BomAddLineFormProps) {
  const [deviceName, setDeviceName] = useState("");
  const [category, setCategory] = useState<BomLineCreatePayload["category"]>("control_equipment");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("ea");
  const [unitPrice, setUnitPrice] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(unitPrice);
    if (deviceName.trim().length < 2) return setFormError("Enter an item name.");
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) return setFormError("Quantity must be a whole number of 1 or more.");
    if (unitPrice.trim() === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) return setFormError("Enter a unit price of 0 or more.");
    setFormError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        device_type: toDeviceType(deviceName),
        device_name: deviceName.trim(),
        category,
        quantity: parsedQuantity,
        unit: unit.trim() || "ea",
        company_unit_price: Math.round(parsedPrice * 100) / 100,
        manufacturer: manufacturer.trim() || null,
        part_number: partNumber.trim() || null,
        notes: notes.trim() || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName = "w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm focus:border-primary focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[14px] border border-sky-200 bg-sky-50/50 p-4" data-testid="bom-add-line-form">
      <p className="font-body text-sm font-semibold">Add a line the AI missed</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1 font-body text-xs text-stat-label sm:col-span-2">
          Item name
          <input id="bom-add-name" value={deviceName} onChange={(event) => setDeviceName(event.target.value)} placeholder="e.g. Fire alarm document box" className={fieldClassName} />
        </label>
        <label className="space-y-1 font-body text-xs text-stat-label">
          Category
          <select id="bom-add-category" value={category} onChange={(event) => setCategory(event.target.value as BomLineCreatePayload["category"])} className={fieldClassName}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1 font-body text-xs text-stat-label">
            Qty
            <input id="bom-add-qty" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClassName} />
          </label>
          <label className="space-y-1 font-body text-xs text-stat-label">
            Unit
            <input id="bom-add-unit" value={unit} onChange={(event) => setUnit(event.target.value)} className={fieldClassName} />
          </label>
        </div>
        <label className="space-y-1 font-body text-xs text-stat-label">
          Unit price (USD)
          <input id="bom-add-price" type="number" min="0" step="0.01" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} placeholder="0.00" className={fieldClassName} />
        </label>
        <label className="space-y-1 font-body text-xs text-stat-label">
          Manufacturer
          <input id="bom-add-manufacturer" value={manufacturer} onChange={(event) => setManufacturer(event.target.value)} className={fieldClassName} />
        </label>
        <label className="space-y-1 font-body text-xs text-stat-label">
          Part number
          <input id="bom-add-part" value={partNumber} onChange={(event) => setPartNumber(event.target.value)} className={fieldClassName} />
        </label>
        <label className="space-y-1 font-body text-xs text-stat-label">
          Notes
          <input id="bom-add-notes" value={notes} onChange={(event) => setNotes(event.target.value)} className={fieldClassName} />
        </label>
      </div>
      {formError ? <p role="alert" className="font-body text-sm text-red-600">{formError}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} data-testid="bom-add-line-submit">
          {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Add line
        </Button>
      </div>
    </form>
  );
}
