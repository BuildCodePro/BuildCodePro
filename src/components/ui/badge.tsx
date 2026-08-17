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
        approved: "bg-blue-50 text-blue-700",
        ai_complete: "bg-emerald-50 text-emerald-700",
        "review_needed": "bg-amber-50 text-amber-700",
        processing: "bg-sky-50 text-sky-700",
        draft: "bg-slate-100 text-slate-600",
        ready: "bg-emerald-50 text-emerald-700",
        change_request: "bg-yellow-50 text-yellow-700",
        under_review: "bg-yellow-50 text-yellow-700"
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  },
);

const statusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  "review_needed": "Review Needed",
  processing: "Processing",
  draft: "Draft",
  exported: "Exported",
  ai_complete: "AI Complete",
  approved: "Approved",
  ready: "Ready",
  change_request: "Change Request",
  under_review: "Under Review",
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
