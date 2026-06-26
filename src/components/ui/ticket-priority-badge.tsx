import { cn } from "@/lib/utils/cn";
import type { TicketPriority } from "@/types/super-admin";

const priorityStyles: Record<TicketPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-warning",
  high: "bg-red-50 text-primary",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function TicketPriorityBadge({
  priority,
  className,
}: TicketPriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium leading-none",
        priorityStyles[priority],
        className,
      )}
    >
      {priorityLabels[priority]}
    </span>
  );
}
