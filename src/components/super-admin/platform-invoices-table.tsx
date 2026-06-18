import { Download } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/ui/invoice-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PlatformInvoice } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";

interface PlatformInvoicesTableProps {
  invoices: PlatformInvoice[];
  className?: string;
}

function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function PlatformInvoicesTable({
  invoices,
  className,
}: PlatformInvoicesTableProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-section-title">Billing History</h2>

      <div className="rounded-[16px] border border-border bg-white p-5 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell className="text-stat-label">{invoice.company}</TableCell>
                <TableCell className="text-stat-label">{invoice.date}</TableCell>
                <TableCell className="text-stat-label">{invoice.plan}</TableCell>
                <TableCell className="font-medium">
                  {formatAmount(invoice.amount)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 rounded-[10px] px-4",
                    )}
                  >
                    <Download className="size-3.5" aria-hidden="true" />
                    PDF
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
