"use client";

import { useState } from "react";
import { Check, Edit2, Loader2, X, DnaOffIcon } from "lucide-react";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBomCategoryLabel } from "@/lib/constants/bom";
import type { BomLineItem } from "@/types/bom";
import { TableEmptyState } from "../ui/emptyState";

interface BomLineItemsTableProps {
  items: BomLineItem[];
  currency?: string;
  onUpdatePrice?: (lineId: string, companyUnitPrice: number) => Promise<void>;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function BomLineItemsTable({
  items,
  currency = "USD",
  onUpdatePrice,
}: BomLineItemsTableProps) {
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEditing = (item: BomLineItem) => {
    setEditingLineId(item.id);
    setEditPrice(String(item.company_unit_price ?? item.effective_price ?? 0));
  };

  const cancelEditing = () => {
    setEditingLineId(null);
    setEditPrice("");
  };

  const handleSavePrice = async (lineId: string) => {
    const numPrice = parseFloat(editPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      return;
    }
    if (!onUpdatePrice) return;

    try {
      setIsSubmitting(true);
      await onUpdatePrice(lineId, numPrice);
      setEditingLineId(null);
    } catch {
      // Error toast handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="bg-slate-50/80 normal-case">Item</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Category</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Qty</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Unit</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">
            Unit Price
          </TableHead>
          <TableHead className="bg-slate-50/80 normal-case">
            Line Total
          </TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Notes</TableHead>
          <TableHead className="bg-slate-50/80 text-right normal-case last:pr-0">
            Confidence
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={8}
              className="py-8 text-center text-stat-label"
            >
              <TableEmptyState title="No line items in this category" icon={<DnaOffIcon className="w-8 h-8" />} />
            </TableCell>
          </TableRow>
        ) : (
          items.map((lineItem) => {
            const isEditing = editingLineId === lineItem.id;

            return (
              <TableRow key={lineItem.id}>
                <TableCell className="font-semibold">
                  {lineItem.device_name}
                </TableCell>
                <TableCell className="text-stat-label">
                  {getBomCategoryLabel(lineItem.category)}
                </TableCell>
                <TableCell className="font-semibold">
                  {lineItem.quantity.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-stat-label">
                  {lineItem.unit}
                </TableCell>
                <TableCell className="text-stat-label min-w-[140px]">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-20 rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSavePrice(lineItem.id);
                          if (e.key === "Escape") cancelEditing();
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSavePrice(lineItem.id)}
                        disabled={isSubmitting}
                        className="rounded p-1 text-success hover:bg-success/10 disabled:opacity-50"
                        title="Save price"
                      >
                        {isSubmitting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={isSubmitting}
                        className="rounded p-1 text-stat-label hover:bg-slate-200 disabled:opacity-50"
                        title="Cancel"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="group flex items-center gap-1.5">
                      <span>{formatCurrency(lineItem.effective_price, currency)}</span>
                      {onUpdatePrice ? (
                        <button
                          type="button"
                          onClick={() => startEditing(lineItem)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 rounded p-1 text-stat-label hover:text-foreground"
                          title="Edit unit price"
                        >
                          <Edit2 className="size-3" />
                        </button>
                      ) : null}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(lineItem.line_total, currency)}
                </TableCell>
                <TableCell className="max-w-[220px] text-stat-label">
                  {lineItem.notes ?? lineItem.ai_price_source ?? "—"}
                </TableCell>
                <TableCell className="text-right last:pr-0">
                  <ConfidenceBadge
                    confidence={Math.round(lineItem.confidence * 100)}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}