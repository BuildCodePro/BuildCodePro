"use client";

import { Download, Loader2 } from "lucide-react";

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
import { cn } from "@/lib/utils/cn";
import { useMeQuery } from "@/services/authService";
import { useAdminInvoicesQuery } from "@/services/useAdminSubscriptions";
import type { AdminInvoiceStatus } from "@/services/useAdminSubscriptions";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { useState } from "react";
import { InvoiceStatus } from "@/lib/constants/billing";
import { useInvoicesQuery } from "@/services/userBillingService";

interface InvoiceHistoryProps {
  className?: string;
}

interface InvoicePdfResponse {
  invoice_id: string;
  pdf_url: string;
}

function formatAmount(amountCents: number): string {
  return `$${(amountCents / 100).toFixed(2)}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Maps backend invoice status to the UI badge's expected status values.
function mapToInvoiceStatus(status: AdminInvoiceStatus): InvoiceStatus {
  switch (status) {
    case "paid":
      return "paid";
    case "open":
      return "pending";
    case "void":
    case "uncollectible":
      return "failed";
    default:
      return "pending";
  }
}

export function InvoiceHistory({ className }: InvoiceHistoryProps) {
  const { data: me } = useMeQuery();
  const companyId = me?.company_id;

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const invoicesQuery = useInvoicesQuery({
    page: 1,
    page_size: 50,
    ...(companyId ? { company_id: companyId } : {}),
  } as never);

  const invoices = (invoicesQuery.data?.items ?? []).filter(
    (invoice) => !companyId || invoice.company_id === companyId,
  );

  const handleDownload = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    try {
      const result = await apiRequest<InvoicePdfResponse>(
        API_ENDPOINTS.USER_INVOICE.INVOICE_PDF(invoiceId),
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

  if (invoicesQuery.isLoading) {
    return (
      <section className={cn("space-y-4", className)}>
        <h2 className="text-section-title font-body">Invoice History</h2>
        <TableSkeleton columns={6} rows={5} />
      </section>
    );
  }

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-section-title font-body">Invoice History</h2>

      <div className="rounded-[16px] border border-border bg-white p-5 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice ID</TableHead>
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
                  colSpan={6}
                  className="text-center text-sm text-stat-label"
                >
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => {
                const isDownloading = downloadingId === invoice.invoice_id;

                return (
                  <TableRow key={invoice.invoice_id}>
                    <TableCell className="font-medium">
                      {invoice.invoice_number || invoice.invoice_id}
                    </TableCell>
                    <TableCell className="text-stat-label">
                      {formatDate(invoice.issued_at)}
                    </TableCell>
                    <TableCell className="text-stat-label">
                      {invoice.plan_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(invoice.amount_cents)}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge
                        status={mapToInvoiceStatus(invoice.status)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(invoice.invoice_id)}
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