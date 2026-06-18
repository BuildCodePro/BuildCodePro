import { AlertCircle, AlertTriangle, Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { ComplianceItemStatus } from "@/types/new-design";

const statusConfig: Record<
  ComplianceItemStatus,
  {
    label: string;
    className: string;
    icon: typeof Check;
  }
> = {
  pass: {
    label: "Pass",
    className: "bg-emerald-50 text-success",
    icon: Check,
  },
  "review-needed": {
    label: "Review Needed",
    className: "bg-amber-50 text-warning",
    icon: AlertTriangle,
  },
  concern: {
    label: "Concern",
    className: "bg-red-50 text-primary",
    icon: AlertCircle,
  },
};

interface ComplianceStatusBadgeProps {
  status: ComplianceItemStatus;
  className?: string;
}

export function ComplianceStatusBadge({
  status,
  className,
}: ComplianceStatusBadgeProps) {
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
      <Icon className="size-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}
