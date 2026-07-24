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

interface BomLineItemsTableProps {
  items: BomLineItem[];
  currency?: string;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BomLineItemsTable({
  items,
  currency = "USD",
}: BomLineItemsTableProps) {
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
              No line items in this category
            </TableCell>
          </TableRow>
        ) : (
          items.map((lineItem) => (
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
              <TableCell className="text-stat-label">
                {formatCurrency(lineItem.effective_price, currency)}
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
          ))
        )}
      </TableBody>
    </Table>
  );
}