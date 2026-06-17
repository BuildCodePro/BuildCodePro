import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BomLineItem } from "@/types/new-design";

interface BomLineItemsTableProps {
  items: BomLineItem[];
}

export function BomLineItemsTable({ items }: BomLineItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="bg-slate-50/80 normal-case">Item</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Category</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Qty</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Unit</TableHead>
          <TableHead className="bg-slate-50/80 normal-case">Notes</TableHead>
          <TableHead className="bg-slate-50/80 text-right normal-case last:pr-0">
            Confidence
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((lineItem) => (
          <TableRow key={lineItem.id}>
            <TableCell className="font-semibold">{lineItem.item}</TableCell>
            <TableCell className="text-stat-label">{lineItem.category}</TableCell>
            <TableCell className="font-semibold">
              {lineItem.qty.toLocaleString("en-US")}
            </TableCell>
            <TableCell className="text-stat-label">{lineItem.unit}</TableCell>
            <TableCell className="max-w-[220px] text-stat-label">
              {lineItem.notes}
            </TableCell>
            <TableCell className="text-right last:pr-0">
              <ConfidenceBadge confidence={lineItem.confidence} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
