import { cn } from "@/lib/utils/cn";

interface SuperAdminModuleHeaderProps {
  title: string;
  description: string;
  className?: string;
  actions?: React.ReactNode;
}

export function SuperAdminModuleHeader({
  title,
  description,
  className,
  actions,
}: SuperAdminModuleHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="space-y-1 flex-1 pr-4">
        <h2 className="text-section-title font-body">{title}</h2>
        <p className="font-body text-sm text-stat-label">{description}</p>
      </div>
      {actions && <div className="shrink-0 pt-1">{actions}</div>}
    </div>
  );
}
