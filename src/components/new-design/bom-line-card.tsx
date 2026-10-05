"use client";

import { useState } from "react";
import { CheckCircle2, Edit2, ExternalLink, History, Loader2, RotateCcw, Trash2 } from "lucide-react";

import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { GENERIC_ITEM_LABEL, getBomCategoryLabel, isGenericBomItem } from "@/lib/constants/bom";
import { buildChangedPayload, formatBomCurrency, type LineDraft, validateDraft } from "@/lib/utils/bom-line-draft";
import { cn } from "@/lib/utils/cn";
import type { BomLineItem, BomLineUpdatePayload, PartResolutionStatus } from "@/types/bom";

const RESOLUTION_LABELS: Record<PartResolutionStatus, string> = {
  spec: "Per spec",
  past_bom: "Approved before",
  catalog: "From catalog",
  web: "Web sourced",
  unresolved: "Not resolved",
};

const AI_SUGGESTED_LABEL = "AI suggested";

const ALLOWANCE_LABEL = "Allowance";

const INCOMPATIBLE_PART_NOTE_PATTERN = /part on .+ panel; use an? .+ equivalent\.?$/i;

type ReviewSeverity = "none" | "confirm" | "incompatible";

const REVIEW_STYLES: Record<Exclude<ReviewSeverity, "none">, { card: string; text: string; chip: string; label: string }> = {
  confirm: { card: "border-amber-200 bg-amber-50/40", text: "text-amber-700", chip: "bg-amber-50 text-amber-700", label: "Confirm" },
  incompatible: { card: "border-red-200 bg-red-50/40", text: "text-red-700", chip: "bg-red-50 text-red-600", label: "Wrong part" },
};

export function getReviewSeverity(lineItem: BomLineItem): ReviewSeverity {
  if (!lineItem.review_note || lineItem.is_deleted) return "none";
  return INCOMPATIBLE_PART_NOTE_PATTERN.test(lineItem.review_note) ? "incompatible" : "confirm";
}

const RESOLUTION_STYLES: Record<PartResolutionStatus, string> = {
  spec: "bg-success/10 text-success",
  past_bom: "bg-success/10 text-success",
  catalog: "bg-primary/10 text-primary",
  web: "bg-amber-500/10 text-amber-600",
  unresolved: "bg-slate-100 text-stat-label",
};

interface BomLineCardProps {
  lineItem: BomLineItem;
  currency: string;
  canEdit: boolean;
  onSaveLine: (lineId: string, payload: BomLineUpdatePayload) => Promise<void>;
  onDeleteLine: (lineId: string) => Promise<void>;
  onRestoreLine: (lineId: string) => Promise<void>;
  onShowHistory: (lineItem: BomLineItem) => void;
}

function LineStatusChip({ lineItem }: { lineItem: BomLineItem }) {
  if (lineItem.is_deleted) {
    return <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-stat-label">Removed</span>;
  }
  const reviewSeverity = getReviewSeverity(lineItem);
  if (reviewSeverity !== "none") {
    const reviewStyle = REVIEW_STYLES[reviewSeverity];
    return <span className={cn("w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold", reviewStyle.chip)} data-testid="bom-review-chip">{reviewStyle.label}</span>;
  }
  if (lineItem.needs_review_after_rerun) {
    return <span className="w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">Review after re-run</span>;
  }
  if (lineItem.is_manual_override) {
    return <span className="w-fit rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800">Edited</span>;
  }
  if (isGenericBomItem(lineItem)) {
    return <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-stat-label" data-testid="bom-allowance-chip">{ALLOWANCE_LABEL}</span>;
  }
  return <ConfidenceBadge confidence={Math.round(lineItem.confidence * 100)} className="w-fit min-w-0 px-2 py-0.5 text-[11px]" />;
}

export function BomLineCard({ lineItem, currency, canEdit, onSaveLine, onDeleteLine, onRestoreLine, onShowHistory }: BomLineCardProps) {
  const [draft, setDraft] = useState<LineDraft | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const reviewSeverity = getReviewSeverity(lineItem);
  const reviewStyle = reviewSeverity === "none" ? null : REVIEW_STYLES[reviewSeverity];
  const citationUrl = lineItem.datasheet_url ?? lineItem.listing_url;
  const isLaborLine = !lineItem.part_number && lineItem.unit.toLowerCase().startsWith("hr");
  const resolutionLabel = isGenericBomItem(lineItem)
    ? GENERIC_ITEM_LABEL
    : lineItem.part_number && lineItem.resolution_status === "unresolved"
      ? AI_SUGGESTED_LABEL
      : RESOLUTION_LABELS[lineItem.resolution_status];

  const runLineAction = async (action: () => Promise<void>) => {
    setIsBusy(true);
    try {
      await action();
    } catch {
      return false;
    } finally {
      setIsBusy(false);
    }
    return true;
  };

  const startEditing = () => {
    setDraftError(null);
    setDraft({ quantity: String(lineItem.quantity), unit: lineItem.unit, unitPrice: String(lineItem.effective_price ?? 0) });
  };

  const saveDraft = async () => {
    if (!draft) return;
    const validationMessage = validateDraft(draft);
    if (validationMessage) {
      setDraftError(validationMessage);
      return;
    }
    const payload = buildChangedPayload(lineItem, draft);
    if (Object.keys(payload).length === 0 || (await runLineAction(() => onSaveLine(lineItem.id, payload)))) setDraft(null);
  };

  const inputClassName = "w-24 rounded-[10px] border border-input-border bg-background px-2 py-1 text-sm text-foreground focus:border-primary focus:outline-none";
  const actionClassName = "inline-flex items-center gap-1 rounded-[8px] px-2 py-1 font-body text-xs font-medium text-stat-label hover:bg-surface hover:text-foreground disabled:opacity-50";

  return (
    <article
      data-testid="bom-line-row"
      data-device-type={lineItem.device_type}
      className={cn(
        "flex flex-col overflow-hidden rounded-[16px] border bg-background",
        reviewStyle ? reviewStyle.card : "border-border",
        lineItem.is_deleted && "border-dashed opacity-60",
      )}
    >
      <div className="flex flex-col gap-2 px-4 pb-3 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <LineStatusChip lineItem={lineItem} />
            <h4 className={cn("font-body text-[15px] font-semibold leading-snug", reviewStyle ? reviewStyle.text : "text-foreground", lineItem.is_deleted && "line-through")}>
              {lineItem.device_name}
            </h4>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-base font-bold tabular-nums text-foreground">{formatBomCurrency(lineItem.line_total, currency)}</p>
            <p className="font-body text-xs tabular-nums text-stat-label">
              {lineItem.quantity.toLocaleString("en-US")} {lineItem.unit} × {formatBomCurrency(lineItem.effective_price, currency)}
            </p>
          </div>
        </div>
        {isLaborLine ? null : (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-xs text-stat-label" data-testid="bom-part-cell" data-resolution={lineItem.resolution_status}>
            <span className="rounded-[6px] bg-surface px-1.5 py-0.5 font-mono font-semibold text-foreground" data-testid="bom-part-number">{lineItem.part_number ?? "No part number"}</span>
            {lineItem.manufacturer ? <span data-testid="bom-manufacturer">{lineItem.manufacturer}</span> : null}
          </p>
        )}
        {reviewStyle ? (
          <p className={cn("rounded-[10px] px-3 py-2 font-body text-xs font-medium leading-relaxed", reviewStyle.chip)} data-testid="bom-review-note">
            {lineItem.review_note}
          </p>
        ) : null}
        {lineItem.notes ? <p className="font-body text-xs leading-relaxed text-stat-label">{lineItem.notes}</p> : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2">
        <div className="flex flex-wrap items-center gap-2 font-body text-xs text-stat-label">
          {isLaborLine ? null : (
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", RESOLUTION_STYLES[lineItem.resolution_status])} data-testid="bom-resolution-badge">
              {resolutionLabel}
            </span>
          )}
          <span>{getBomCategoryLabel(lineItem.category)}</span>
          {citationUrl ? (
            <a href={citationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary hover:underline" data-testid="bom-datasheet-link">
              Datasheet <ExternalLink className="size-3" />
            </a>
          ) : null}
        </div>
        {canEdit ? (
          <div className="flex items-center">
            {lineItem.is_deleted ? (
              <button type="button" className={cn(actionClassName, "text-primary")} disabled={isBusy} onClick={() => void runLineAction(() => onRestoreLine(lineItem.id))} data-testid="bom-line-restore">
                {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCcw className="size-3.5" />} Restore
              </button>
            ) : (
              <>
                <button type="button" className={actionClassName} onClick={startEditing} disabled={isBusy || draft !== null} aria-label={`Edit ${lineItem.device_name}`} data-testid="bom-line-edit">
                  <Edit2 className="size-3.5" /> Edit
                </button>
                {lineItem.review_note || lineItem.needs_review_after_rerun ? (
                  <button type="button" className={cn(actionClassName, "text-emerald-700 hover:text-emerald-800")} disabled={isBusy || draft !== null} onClick={() => void runLineAction(() => onSaveLine(lineItem.id, { mark_reviewed: true }))} aria-label={`Mark ${lineItem.device_name} reviewed`} data-testid="bom-line-mark-reviewed">
                    {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />} Mark reviewed
                  </button>
                ) : null}
                <button type="button" className={actionClassName} onClick={() => onShowHistory(lineItem)} aria-label={`History for ${lineItem.device_name}`}>
                  <History className="size-3.5" /> History
                </button>
                <button type="button" className={cn(actionClassName, "hover:text-red-600")} disabled={isBusy} onClick={() => void runLineAction(() => onDeleteLine(lineItem.id))} aria-label={`Remove ${lineItem.device_name}`} data-testid="bom-line-delete">
                  {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />} Remove
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
      {draft ? (
        <div className="flex flex-wrap items-end gap-2 border-t border-border bg-surface px-4 py-3">
          <label className="grid gap-0.5 font-body text-xs text-stat-label">
            Quantity
            <input aria-label="Quantity" type="number" min="0" step="1" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: event.target.value })} className={inputClassName} autoFocus />
          </label>
          <label className="grid gap-0.5 font-body text-xs text-stat-label">
            Unit
            <input aria-label="Unit" value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value })} className={cn(inputClassName, "w-16")} />
          </label>
          <label className="grid gap-0.5 font-body text-xs text-stat-label">
            Unit price
            <input
              aria-label="Unit price"
              type="number"
              min="0"
              step="0.01"
              value={draft.unitPrice}
              onChange={(event) => setDraft({ ...draft, unitPrice: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Enter") void saveDraft();
                if (event.key === "Escape") setDraft(null);
              }}
              className={inputClassName}
            />
          </label>
          <button type="button" onClick={() => void saveDraft()} disabled={isBusy} className="h-8 rounded-[10px] bg-primary px-3 font-body text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50" aria-label="Save changes">
            {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : "Save"}
          </button>
          <button type="button" onClick={() => setDraft(null)} disabled={isBusy} className="h-8 rounded-[10px] border border-border px-3 font-body text-xs font-semibold text-foreground" aria-label="Cancel editing">Cancel</button>
          {draftError ? <span role="alert" className="font-body text-xs font-medium text-red-600">{draftError}</span> : null}
        </div>
      ) : null}
    </article>
  );
}
