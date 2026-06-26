import { cn } from "@/lib/utils/cn";
import type { TicketStatus } from "@/types/super-admin";

const statusStyles: Record<TicketStatus, string> = {
  open: "bg-red-50 text-primary",
  in_progress: "bg-sky-50 text-sky-700",
  resolved: "bg-emerald-50 text-success",
  closed: "bg-slate-100 text-slate-600",
};

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium leading-none whitespace-nowrap",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
