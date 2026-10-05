"use client";

import { DnaOffIcon } from "lucide-react";

import { formatBomCurrency } from "@/lib/utils/bom-line-draft";
import type { BomLineItem, BomLineUpdatePayload } from "@/types/bom";

import { TableEmptyState } from "../ui/emptyState";
import { BomLineCard } from "./bom-line-card";

interface BomReviewBoardProps {
  lines: BomLineItem[];
  currency: string;
  canEdit: boolean;
  showNeedsReviewOnly: boolean;
  onSaveLine: (lineId: string, payload: BomLineUpdatePayload) => Promise<void>;
  onDeleteLine: (lineId: string) => Promise<void>;
  onRestoreLine: (lineId: string) => Promise<void>;
  onShowHistory: (lineItem: BomLineItem) => void;
}

interface BoardColumn {
  id: string;
  title: string;
  lines: BomLineItem[];
}

function sumLineTotals(lines: BomLineItem[]) {
  return lines.reduce((runningTotal, lineItem) => runningTotal + (lineItem.is_deleted ? 0 : lineItem.line_total), 0);
}

export function BomReviewBoard({ lines, currency, canEdit, showNeedsReviewOnly, onSaveLine, onDeleteLine, onRestoreLine, onShowHistory }: BomReviewBoardProps) {
  const activeLines = lines.filter((lineItem) => !lineItem.is_deleted);
  const removedLines = lines.filter((lineItem) => lineItem.is_deleted);
  const attentionColumn: BoardColumn = { id: "attention", title: "Needs attention", lines: activeLines.filter((lineItem) => lineItem.needs_review) };
  const readyColumn: BoardColumn = { id: "ready", title: "Ready", lines: activeLines.filter((lineItem) => !lineItem.needs_review) };
  const visibleColumns = showNeedsReviewOnly ? [attentionColumn] : [attentionColumn, readyColumn];
  const filledColumns = visibleColumns.filter((column) => column.lines.length > 0);
  const emptyColumns = visibleColumns.filter((column) => column.lines.length === 0);
  const cardHandlers = { currency, canEdit, onSaveLine, onDeleteLine, onRestoreLine, onShowHistory };

  if (lines.length === 0) {
    return (
      <div className="rounded-[16px] border border-border bg-background py-10">
        <TableEmptyState title="No line items in this view" icon={<DnaOffIcon className="h-8 w-8" />} />
      </div>
    );
  }

  const renderColumn = (column: BoardColumn, isWide = false) => (
    <section key={column.id} aria-label={column.title} data-testid={`bom-column-${column.id}`} className="flex flex-col gap-3 rounded-[16px] bg-surface p-3">
      <header className="flex items-center justify-between px-1 font-heading text-sm font-bold text-foreground">
        <span>{column.title} · {column.lines.length}</span>
        <span className="tabular-nums">{formatBomCurrency(sumLineTotals(column.lines), currency)}</span>
      </header>
      <div className={isWide ? "grid grid-cols-1 items-start gap-3 lg:grid-cols-2" : "flex flex-col gap-3"}>
        {column.lines.map((lineItem) => <BomLineCard key={lineItem.id} lineItem={lineItem} {...cardHandlers} />)}
      </div>
    </section>
  );

  return (
    <div className="space-y-4">
      {emptyColumns.length ? (
        <div className="flex flex-wrap gap-2">
          {emptyColumns.map((column) => (
            <span key={column.id} data-testid={`bom-column-${column.id}`} className="rounded-full bg-surface px-3 py-1 font-body text-xs text-stat-label">
              {column.title} · 0
            </span>
          ))}
        </div>
      ) : null}
      <div className={filledColumns.length === 2 ? "grid grid-cols-1 items-start gap-4 xl:grid-cols-2" : "grid grid-cols-1 gap-4"}>
        {filledColumns.map((column) => renderColumn(column, filledColumns.length === 1))}
      </div>
      {removedLines.length ? renderColumn({ id: "removed", title: "Removed", lines: removedLines }, true) : null}
    </div>
  );
}
