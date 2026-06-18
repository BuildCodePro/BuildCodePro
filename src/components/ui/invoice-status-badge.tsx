import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { InvoiceStatus } from "@/lib/constants/billing";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string; icon?: typeof Check }
> = {
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-success",
    icon: Check,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-warning",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-primary",
  },
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs font-semibold whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      {config.label}
    </span>
  );
}
