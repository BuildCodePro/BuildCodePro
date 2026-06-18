import { cn } from "@/lib/utils/cn";
import type { PlatformUserStatus } from "@/types/super-admin";

const statusStyles: Record<PlatformUserStatus, string> = {
  active: "bg-emerald-50 text-success",
  pending: "bg-amber-50 text-warning",
  suspended: "bg-red-50 text-primary",
};

const statusLabels: Record<PlatformUserStatus, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
};

interface UserStatusBadgeProps {
  status: PlatformUserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium leading-none",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
