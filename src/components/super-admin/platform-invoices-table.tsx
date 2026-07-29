"use client";

import { useState } from "react";
import { Download, FileTerminal, Loader2 } from "lucide-react";

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
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { PlatformInvoice } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";
import { TableEmptyState } from "../ui/emptyState";

interface PlatformInvoicesTableProps {
  invoices: PlatformInvoice[];
  isLoading?: boolean;
  className?: string;
}

interface InvoicePdfResponse {
  invoice_id: string;
  pdf_url: string;
}

function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function PlatformInvoicesTable({
  invoices,
  isLoading = false,
  className,
}: PlatformInvoicesTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (invoice: PlatformInvoice) => {
    const invoiceId = invoice.invoiceId ?? invoice.id;

    setDownloadingId(invoiceId);
    try {
      const result = await apiRequest<InvoicePdfResponse>(
        API_ENDPOINTS.ADMIN_SUBSCRIPTIONS.INVOICE_PDF(invoiceId),
      );

      if (result?.pdf_url) {
        window.open(result.pdf_url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to generate invoice PDF", error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <section className={cn("space-y-4", className)}>
        <h2 className="text-section-title">Billing History</h2>
        <TableSkeleton columns={7} rows={5} />
      </section>
    );
  }

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
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-sm text-stat-label"
                >
                  <TableEmptyState title="No invoices found." icon={<FileTerminal className="w-8 h-8" />} />
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => {
                const invoiceId = invoice.invoiceId ?? invoice.id;
                const isDownloading = downloadingId === invoiceId;

                return (
                  <TableRow key={invoiceId}>
                    <TableCell className="font-medium">
                      {invoice.id}
                    </TableCell>
                    <TableCell className="text-stat-label">
                      {invoice.company}
                    </TableCell>
                    <TableCell className="text-stat-label">
                      {invoice.date}
                    </TableCell>
                    <TableCell className="text-stat-label">
                      {invoice.plan}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(invoice)}
                        disabled={isDownloading}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-9 rounded-[10px] px-4 disabled:opacity-60",
                        )}
                      >
                        {isDownloading ? (
                          <Loader2
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Download className="size-3.5" aria-hidden="true" />
                        )}
                        {isDownloading ? "Generating..." : "PDF"}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}