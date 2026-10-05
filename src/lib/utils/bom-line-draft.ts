import type { BomLineItem, BomLineUpdatePayload } from "@/types/bom";

export interface LineDraft {
  quantity: string;
  unit: string;
  unitPrice: string;
}

export function formatBomCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function validateDraft(draft: LineDraft): string | null {
  const quantity = Number(draft.quantity);
  const unitPrice = Number(draft.unitPrice);
  if (!Number.isInteger(quantity) || quantity < 0) return "Quantity must be a whole number, 0 or more.";
  if (!Number.isFinite(unitPrice) || unitPrice < 0) return "Unit price must be 0 or more.";
  if (!draft.unit.trim()) return "Unit is required.";
  return null;
}

export function buildChangedPayload(lineItem: BomLineItem, draft: LineDraft): BomLineUpdatePayload {
  const payload: BomLineUpdatePayload = {};
  const quantity = Number(draft.quantity);
  const unitPrice = Math.round(Number(draft.unitPrice) * 100) / 100;
  if (quantity !== lineItem.quantity) payload.quantity = quantity;
  if (draft.unit.trim() !== lineItem.unit) payload.unit = draft.unit.trim();
  if (unitPrice !== lineItem.effective_price) payload.company_unit_price = unitPrice;
  return payload;
}
