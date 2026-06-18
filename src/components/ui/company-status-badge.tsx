import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { CompanyStatus } from "@/types/super-admin";

const companyStatusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium leading-none",
  {
    variants: {
      status: {
        active: "bg-emerald-50 text-success",
        trial: "bg-sky-50 text-sky-700",
        suspended: "bg-red-50 text-primary",
      },
    },
    defaultVariants: {
      status: "active",
    },
  },
);

const statusLabels: Record<CompanyStatus, string> = {
  active: "Active",
  trial: "Trial",
  suspended: "Suspended",
};

interface CompanyStatusBadgeProps extends VariantProps<typeof companyStatusVariants> {
  status: CompanyStatus;
  className?: string;
}

export function CompanyStatusBadge({ status, className }: CompanyStatusBadgeProps) {
  return (
    <span className={cn(companyStatusVariants({ status }), className)}>
      {statusLabels[status]}
    </span>
  );
}
