"use client";

import { useState } from "react";
import { Check, DnaOffIcon, Edit2, History, Loader2, RotateCcw, Trash2, X } from "lucide-react";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PartNumberCell } from "@/components/ui/part-number-cell";
import { getBomCategoryLabel } from "@/lib/constants/bom";
import { cn } from "@/lib/utils/cn";
import { buildChangedPayload, formatBomCurrency as formatCurrency, type LineDraft, validateDraft } from "@/lib/utils/bom-line-draft";
import type { BomLineItem, BomLineUpdatePayload } from "@/types/bom";
import { TableEmptyState } from "../ui/emptyState";

interface BomLineItemsTableProps {
  items: BomLineItem[];
  currency?: string;
  canEdit?: boolean;
  onSaveLine?: (lineId: string, payload: BomLineUpdatePayload) => Promise<void>;
  onDeleteLine?: (lineId: string) => Promise<void>;
  onRestoreLine?: (lineId: string) => Promise<void>;
  onShowHistory?: (lineItem: BomLineItem) => void;
}

function OriginalValue({ value }: { value: unknown }) {
  if (value === undefined || value === null) return null;
  return (
    <span className="block text-[11px] font-normal text-stat-label line-through" title="Original AI value">
      {String(value)}
    </span>
  );
}

function LineSourceChip({ lineItem }: { lineItem: BomLineItem }) {
  if (lineItem.needs_review_after_rerun) {
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">Review after re-run</span>;
  }
  if (lineItem.is_manual_override) {
    return <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800">Edited</span>;
  }
  return <ConfidenceBadge confidence={Math.round(lineItem.confidence * 100)} />;
}

export function BomLineItemsTable({
  items,
  currency = "USD",
  canEdit = false,
  onSaveLine,
  onDeleteLine,
  onRestoreLine,
  onShowHistory,
}: BomLineItemsTableProps) {
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [draft, setDraft] = useState<LineDraft>({ quantity: "", unit: "", unitPrice: "" });
  const [draftError, setDraftError] = useState<string | null>(null);
  const [busyLineId, setBusyLineId] = useState<string | null>(null);

  const startEditing = (lineItem: BomLineItem) => {
    setEditingLineId(lineItem.id);
    setDraftError(null);
    setDraft({
      quantity: String(lineItem.quantity),
      unit: lineItem.unit,
      unitPrice: String(lineItem.effective_price ?? 0),
    });
  };

  const cancelEditing = () => {
    setEditingLineId(null);
    setDraftError(null);
  };

  const runLineAction = async (lineId: string, action: () => Promise<void>) => {
    setBusyLineId(lineId);
    try {
      await action();
    } finally {
      setBusyLineId(null);
    }
  };

  const saveLine = async (lineItem: BomLineItem) => {
    const validationMessage = validateDraft(draft);
    if (validationMessage) {
      setDraftError(validationMessage);
      return;
    }
    const payload = buildChangedPayload(lineItem, draft);
    if (!onSaveLine || Object.keys(payload).length === 0) {
      cancelEditing();
      return;
    }
    try {
      await runLineAction(lineItem.id, () => onSaveLine(lineItem.id, payload));
      cancelEditing();
    } catch {
      return;
    }
  };

  const inputClassName =
    "rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none";

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="bg-slate-50/80 normal-case">Item</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Category</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Part</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Qty</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Unit</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Unit Price</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Line Total</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Notes</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Source</TableHead>
          {canEdit ? <TableHead className="bg-slate-50/80 text-right normal-case last:pr-0">Actions</TableHead> : null}
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={canEdit ? 10 : 9} className="py-8 text-center text-stat-label">
              <TableEmptyState title="No line items in this view" icon={<DnaOffIcon className="h-8 w-8" />} />
            </TableCell>
          </TableRow>
        ) : (
          items.map((lineItem) => {
            const isEditing = editingLineId === lineItem.id;
            const isBusy = busyLineId === lineItem.id;
            const originalValues = lineItem.original_values ?? {};
            return (
              <TableRow
                key={lineItem.id}
                data-testid="bom-line-row"
                data-device-type={lineItem.device_type}
                className={cn(lineItem.is_deleted && "opacity-50", isEditing && "bg-sky-50/60")}
              >
                <TableCell className="font-semibold">
                  <span className={cn(lineItem.is_deleted && "line-through")}>{lineItem.device_name}</span>
                </TableCell>
                <TableCell className="text-stat-label">{getBomCategoryLabel(lineItem.category)}</TableCell>
                <TableCell className="min-w-[160px]">
                  <PartNumberCell lineItem={lineItem} />
                </TableCell>
                <TableCell className="font-semibold tabular-nums">
                  {isEditing ? (
                    <input
                      aria-label="Quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={draft.quantity}
                      onChange={(event) => setDraft({ ...draft, quantity: event.target.value })}
                      className={cn(inputClassName, "w-20")}
                      autoFocus
                    />
                  ) : (
                    <>
                      {lineItem.quantity.toLocaleString("en-US")}
                      <OriginalValue value={originalValues.quantity} />
                    </>
                  )}
                </TableCell>
                <TableCell className="text-stat-label">
                  {isEditing ? (
                    <input
                      aria-label="Unit"
                      value={draft.unit}
                      onChange={(event) => setDraft({ ...draft, unit: event.target.value })}
                      className={cn(inputClassName, "w-16")}
                    />
                  ) : (
                    <>
                      {lineItem.unit}
                      <OriginalValue value={originalValues.unit} />
                    </>
                  )}
                </TableCell>
                <TableCell className="min-w-[120px] text-stat-label tabular-nums">
                  {isEditing ? (
                    <input
                      aria-label="Unit price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.unitPrice}
                      onChange={(event) => setDraft({ ...draft, unitPrice: event.target.value })}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") void saveLine(lineItem);
                        if (event.key === "Escape") cancelEditing();
                      }}
                      className={cn(inputClassName, "w-24")}
                    />
                  ) : (
                    <>
                      {formatCurrency(lineItem.effective_price, currency)}
                      {originalValues.company_unit_price !== undefined && lineItem.ai_unit_price ? (
                        <OriginalValue value={formatCurrency(lineItem.ai_unit_price, currency)} />
                      ) : null}
                    </>
                  )}
                </TableCell>
                <TableCell className="font-semibold tabular-nums">{formatCurrency(lineItem.line_total, currency)}</TableCell>
                <TableCell className="max-w-[220px] text-stat-label">
                  {isEditing && draftError ? (
                    <span role="alert" className="text-xs font-medium text-red-600">{draftError}</span>
                  ) : (
                    lineItem.notes ?? lineItem.ai_price_source ?? "—"
                  )}
                </TableCell>
                <TableCell>
                  <LineSourceChip lineItem={lineItem} />
                </TableCell>
                {canEdit ? (
                  <TableCell className="text-right last:pr-0">
                    <div className="flex justify-end gap-1">
                      {isEditing ? (
                        <>
                          <button type="button" onClick={() => void saveLine(lineItem)} disabled={isBusy} className="rounded p-1.5 text-success hover:bg-success/10 disabled:opacity-50" title="Save changes" aria-label="Save changes">
                            {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                          </button>
                          <button type="button" onClick={cancelEditing} disabled={isBusy} className="rounded p-1.5 text-stat-label hover:bg-slate-200 disabled:opacity-50" title="Cancel" aria-label="Cancel editing">
                            <X className="size-4" />
                          </button>
                        </>
                      ) : lineItem.is_deleted ? (
                        <button type="button" onClick={() => onRestoreLine && void runLineAction(lineItem.id, () => onRestoreLine(lineItem.id))} disabled={isBusy} className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10" data-testid="bom-line-restore">
                          <RotateCcw className="size-3.5" /> Restore
                        </button>
                      ) : (
                        <>
                          <button type="button" onClick={() => startEditing(lineItem)} className="rounded p-1.5 text-stat-label hover:bg-slate-100 hover:text-foreground" title="Edit quantity, unit and price" aria-label={`Edit ${lineItem.device_name}`} data-testid="bom-line-edit">
                            <Edit2 className="size-4" />
                          </button>
                          {onShowHistory ? (
                            <button type="button" onClick={() => onShowHistory(lineItem)} className="rounded p-1.5 text-stat-label hover:bg-slate-100 hover:text-foreground" title="Change history" aria-label={`History for ${lineItem.device_name}`}>
                              <History className="size-4" />
                            </button>
                          ) : null}
                          <button type="button" onClick={() => onDeleteLine && void runLineAction(lineItem.id, () => onDeleteLine(lineItem.id))} disabled={isBusy} className="rounded p-1.5 text-stat-label hover:bg-red-50 hover:text-red-600" title="Remove from BOM" aria-label={`Remove ${lineItem.device_name}`} data-testid="bom-line-delete">
                            {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
