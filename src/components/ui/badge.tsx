import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/types/dashboard";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium leading-none",
  {
    variants: {
      variant: {
        completed: "bg-emerald-50 text-emerald-700",
        exported: "bg-emerald-50 text-emerald-700",
        "review-needed": "bg-amber-50 text-amber-700",
        processing: "bg-sky-50 text-sky-700",
        draft: "bg-slate-100 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  },
);

const statusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  "review-needed": "Review Needed",
  processing: "Processing",
  draft: "Draft",
  exported: "Exported",
};

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant: status }), className)}>
      {statusLabels[status]}
    </span>
  );
}

export { badgeVariants };
