import { cn } from "@/lib/utils/cn";
import type { PlatformUserRole } from "@/types/super-admin";

const roleStyles: Record<PlatformUserRole, string> = {
  company_owner: "bg-primary/10 text-primary",
  estimator: "bg-sky-50 text-sky-700",
  engineer: "bg-violet-50 text-violet-700",
};

const roleLabels: Record<PlatformUserRole, string> = {
  company_owner: "Company Owner",
  estimator: "Estimator",
  engineer: "Engineer",
};

interface UserRoleBadgeProps {
  role: PlatformUserRole;
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium leading-none",
        roleStyles[role],
        className,
      )}
    >
      {roleLabels[role]}
    </span>
  );
}
